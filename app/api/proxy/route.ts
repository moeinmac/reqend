import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  "accept-encoding",
  "content-encoding",
]);

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);

type ProxyPayload = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

const isPrivateIpv4 = (host: string): boolean => {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;

  const octets = match.slice(1).map(Number);
  if (octets.some((octet) => octet > 255)) return true;

  const [a, b] = octets;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
};

const isPrivateIpv6 = (host: string): boolean => {
  const normalized = host.toLowerCase();
  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("::ffff:")) return isPrivateIpv4(normalized.slice("::ffff:".length));
  return false;
};

const isBlockedHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "metadata.google.internal" || host === "metadata.internal") return true;

  const ipVersion = isIP(host);
  if (ipVersion === 4) return isPrivateIpv4(host);
  if (ipVersion === 6) return isPrivateIpv6(host);
  return false;
};

const assertPublicTarget = async (target: URL) => {
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }

  if (target.username || target.password) {
    throw new Error("URLs with embedded credentials are not allowed");
  }

  const hostname = target.hostname.replace(/^\[|\]$/g, "");
  const blockPrivate = process.env.NODE_ENV === "production";
  if (!blockPrivate) return;

  if (isBlockedHost(hostname)) {
    throw new Error("This host is not allowed");
  }

  if (isIP(hostname)) return;

  const records = await lookup(hostname, { all: true, verbatim: true });
  if (records.length === 0 || records.some((record) => isBlockedHost(record.address))) {
    throw new Error("This host is not allowed");
  }
};

const serializeBody = (body: unknown, headers: Headers): string | undefined => {
  if (body === undefined || body === null) return undefined;
  if (typeof body === "string") return body;
  if (typeof body === "number" || typeof body === "boolean") return String(body);
  if (!headers.has("content-type")) headers.set("content-type", "application/json");
  return JSON.stringify(body);
};

export async function POST(req: Request) {
  let payload: ProxyPayload;
  try {
    payload = (await req.json()) as ProxyPayload;
  } catch {
    return NextResponse.json({ error: "Invalid proxy payload" }, { status: 400 });
  }

  if (!payload.url || typeof payload.url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const method = (payload.method || "GET").toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json({ error: "Method is not allowed" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(payload.url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    await assertPublicTarget(target);
  } catch (error) {
    const message = error instanceof Error ? error.message : "This host is not allowed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const forwardedHeaders = new Headers();
  for (const [key, value] of Object.entries(payload.headers ?? {})) {
    if (typeof value !== "string" || !key.trim()) continue;
    if (HOP_BY_HOP.has(key.toLowerCase())) continue;
    forwardedHeaders.set(key, value);
  }

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? serializeBody(payload.body, forwardedHeaders) : undefined;

  const start = Date.now();
  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers: forwardedHeaders,
      body,
      redirect: "follow",
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const raw = await upstream.text();
  const time = Date.now() - start;
  let data: unknown = raw;
  const contentType = upstream.headers.get("content-type") ?? "";
  const trimmed = raw.trim();
  if (contentType.includes("json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  const headers: Record<string, string> = {};
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    headers[key] = value;
  });

  const size = new TextEncoder().encode(raw).length + JSON.stringify(headers).length;

  return NextResponse.json({
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
    data,
    time,
    size,
  });
}
