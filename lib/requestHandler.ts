import { Request } from "@/db/models.type";
import { HttpResponse } from "@/store/useHttpStore";
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { paramsResolver, urlResolver } from "./variables/resolvers";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    reqendData?: {
      startTime: number;
      time: number;
    };
  }

  export interface AxiosResponse {
    reqendData?: {
      startTime: number;
      time: number;
    };
  }
}

const createTimedAxiosInstance = (): AxiosInstance => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.reqendData = {
        startTime: Date.now(),
        time: 0,
      };
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const startTime = response.config.reqendData?.startTime || Date.now();
      response.reqendData = {
        startTime,
        time: Date.now() - startTime,
      };
      return response;
    },
    (error) => {
      if (error.response && error.config?.reqendData?.startTime) {
        const startTime = error.config.reqendData.startTime;
        error.response.reqendData = {
          startTime,
          time: Date.now() - startTime,
        };
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const timedAxios = createTimedAxiosInstance();

const buildQueryParams = (params: Request["params"], variablesMap: Map<string, string>): string => {
  const selectedParams = params.filter((p) => p.selected);
  if (selectedParams.length === 0) return "";
  const resolvedParams = paramsResolver(selectedParams, variablesMap);

  const queryString = resolvedParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
  return queryString ? `?${queryString}` : "";
};

const buildAuthHeaders = (auth: Request["auth"]): Record<string, string> => {
  const headers: Record<string, string> = {};

  switch (auth.authType) {
    case "bearerToken":
      if (auth.value?.token) {
        headers["Authorization"] = `Bearer ${auth.value.token}`;
      }
      break;

    case "basicAuth":
      if (auth.value?.username && auth.value?.password) {
        const encoded = btoa(`${auth.value.username}:${auth.value.password}`);
        headers["Authorization"] = `Basic ${encoded}`;
      }
      break;

    case "noAuth":
    default:
      break;
  }

  return headers;
};

const buildRequestBody = (body: Request["body"]): any => {
  if (!body || body.type === "none") return undefined;

  switch (body.type) {
    case "json":
      return body.content;

    case "form-data": {
      // TODO: Implement FormData handling
      const formData = new FormData();
      // Example: formData.append('key', 'value');
      return formData;
    }

    default:
      return undefined;
  }
};

const buildRequestHeaders = (headers: Request["headers"]): Record<string, string> => {
  if (!headers) return {};

  const selectedHeaders = headers.filter((h) => h.selected);
  if (selectedHeaders.length === 0) return {};

  const theHeaders: Record<string, string> = {};
  selectedHeaders.forEach((header) => {
    theHeaders[header.key] = header.value;
  });

  return theHeaders;
};

type ProxiedHttpResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  time: number;
  size: number;
  error?: string;
};

const isProxiedHttpResponse = (value: unknown): value is ProxiedHttpResponse => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ProxiedHttpResponse>;
  return typeof candidate.status === "number" && !!candidate.headers && typeof candidate.time === "number" && typeof candidate.size === "number";
};

export const requestHandler = async (request: Request, variablesMap: Map<string, string>): Promise<HttpResponse> => {
  const queryParams = buildQueryParams(request.params, variablesMap);
  const url = `${urlResolver(request.url, variablesMap)}${queryParams}`;

  const authHeaders = buildAuthHeaders(request.auth);
  const body = buildRequestBody(request.body);
  const headers = buildRequestHeaders(request.headers);

  try {
    // Browser calls stay on this origin. The route forwards them server-side,
    // so third-party APIs do not need to allow reqend.vercel.app via CORS.
    const response = await timedAxios.post<ProxiedHttpResponse>("/api/proxy", {
      url,
      method: request.method,
      headers: {
        ...authHeaders,
        ...(request.body?.type === "json" && { "Content-Type": "application/json" }),
        ...headers,
      },
      body,
    });

    if (!isProxiedHttpResponse(response.data)) throw new Error("Unexpected proxy response");

    return {
      status: response.data.status,
      statusText: response.data.statusText,
      headers: response.data.headers,
      data: response.data.data,
      time: response.data.time,
      size: response.data.size,
    };
  } catch (error: any) {
    const proxyError = error?.response?.data?.error;
    throw new Error((typeof proxyError === "string" && proxyError) || error.message || "Network error occurred");
  }
};
