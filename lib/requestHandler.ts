import prettyBytes from "pretty-bytes";

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { Request } from "@/db/models.type";

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

axios.interceptors.response.use(updateRequestTime, (e) => Promise.reject(updateRequestTime(e.response)));

// function updateResponseDetails(response) {
//   document.querySelector("[data-status]").textContent = response.status;
//   document.querySelector("[data-time]").textContent = response.customData.time;
//   document.querySelector("[data-size]").textContent = prettyBytes(JSON.stringify(response.data).length + JSON.stringify(response.headers).length);
// }

// function updateResponseHeaders(headers) {
//   responseHeadersContainer.innerHTML = "";
//   Object.entries(headers).forEach(([key, value]) => {
//     const keyElement = document.createElement("div");
//     keyElement.textContent = key;
//     responseHeadersContainer.append(keyElement);
//     const valueElement = document.createElement("div");
//     valueElement.textContent = value;
//     responseHeadersContainer.append(valueElement);
//   });
// }

export const requestHandler = (request: Request) => {
  axios({
    url: request.url,
    method: request.method,
  })
    .catch((e) => e)
    .then((response) => {
      console.log(response);
    });
};
