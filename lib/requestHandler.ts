import { Request } from "@/db/models.type";
import { HttpResponse } from "@/store/useHttpStore";
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

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
    (error) => Promise.reject(error)
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
    }
  );

  return instance;
};

const timedAxios = createTimedAxiosInstance();

const buildQueryParams = (params: Request["params"]): string => {
  const selectedParams = params.filter((p) => p.selected);
  if (selectedParams.length === 0) return "";
  const queryString = selectedParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
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

const calculateResponseSize = (response: AxiosResponse): number => {
  const dataSize = JSON.stringify(response.data).length;
  const headersSize = JSON.stringify(response.headers).length;
  return dataSize + headersSize;
};

export const requestHandler = async (request: Request): Promise<HttpResponse> => {
  const queryParams = buildQueryParams(request.params);
  const url = `${request.url}${queryParams}`;
  const authHeaders = buildAuthHeaders(request.auth);
  const body = buildRequestBody(request.body);
  const headers = buildRequestHeaders(request.headers);

  try {
    const response = await timedAxios({
      url,
      method: request.method,
      headers: {
        ...authHeaders,
        ...(request.body?.type === "json" && { "Content-Type": "application/json" }),
        ...headers,
      },
      data: body,
    });

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      data: response.data,
      time: response.reqendData?.time || 0,
      size: calculateResponseSize(response),
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>,
        data: error.response.data,
        time: error.response.reqendData?.time || 0,
        size: calculateResponseSize(error.response),
      };
    }

    throw new Error(error.message || "Network error occurred");
  }
};
