import { Request } from "@/db/models.type";
import { HttpResponse } from "@/store/useHttpStore";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    reqendData?: {
      startTime?: number;
      time?: number;
    };
  }

  export interface AxiosResponse {
    reqendData?: {
      startTime?: number;
      time?: number;
    };
  }
}

axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  request.reqendData = request.reqendData || {};
  request.reqendData.startTime = new Date().getTime();
  return request;
});

const updateRequestTime = (response: AxiosResponse) => {
  response.reqendData = response.reqendData || {};
  response.reqendData.time = new Date().getTime() - (response.reqendData.startTime || 0);
  return response;
};

axios.interceptors.response.use(updateRequestTime, (error) => {
  if (error.response) updateRequestTime(error.response);
  return Promise.reject(error);
});

const buildQueryParams = (params: Request["params"]) => {
  const selectedParams = params.filter((p) => p.selected);
  if (selectedParams.length === 0) return "";
  const queryString = selectedParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&");
  return queryString ? `?${queryString}` : "";
};

const buildAuthHeaders = (auth: Request["auth"]) => {
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

const calculateResponseSize = (response: AxiosResponse): number => {
  const dataSize = JSON.stringify(response.data).length;
  const headersSize = JSON.stringify(response.headers).length;
  return dataSize + headersSize;
};

export const requestHandler = async (request: Request): Promise<HttpResponse> => {
  const queryParams = buildQueryParams(request.params);
  const url = `${request.url}${queryParams}`;
  const authHeaders = buildAuthHeaders(request.auth);

  try {
    const response = await axios({
      url,
      method: request.method,
      headers: {
        ...authHeaders,
        ...(request.body?.type === "json" && { "Content-Type": "application/json" }),
      },
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
      // Server responded with error
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
