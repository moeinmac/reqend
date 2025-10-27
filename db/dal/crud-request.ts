import { v4 } from "uuid";
import { getItem, removeItem, setItem } from "../db";
import type { Auth, AuthType, Body, Method, Request } from "../models.type";

export const newRequestHandler = async (newReq: Omit<Request, "id"> & { id?: string }) => {
  const newRequest: Request = {
    ...newReq,
    id: newReq.id ?? v4(),
  };
  await setItem<Request>("request", newRequest.id, newRequest);
  return newRequest;
};

export const fetchRequestHandler = async (reqId: string) => {
  const req = await getItem<Request>("request", reqId);
  return req;
};

export const removeRequestHandler = async (reqId: string) => {
  await removeItem("request", reqId);
};

export const updateRequestUrl = async (reqId: string, newUrl: string) => {
  const theRequest = await getItem<Request>("request", reqId);
  if (theRequest) {
    theRequest.url = newUrl;
    await setItem("request", reqId, theRequest);
    return theRequest;
  }
  return null;
};

export const updateRequestMethod = async (reqId: string, method: Method) => {
  const theRequest = await getItem<Request>("request", reqId);
  if (theRequest) {
    theRequest.method = method;
    await setItem("request", reqId, theRequest);
    return theRequest;
  }
  return null;
};

export const updateRequestNameHandler = async (reqId: string, newName: string) => {
  const theReq = await getItem<Request>("request", reqId);
  if (theReq) {
    theReq.name = newName;
    await setItem<Request>("request", theReq.id, theReq);
    return theReq;
  }
  return null;
};

export const updateAuthTypeHandler = async (reqId: string, authType: Auth["authType"]) => {
  const theReq = await getItem<Request>("request", reqId);
  if (theReq) {
    theReq.auth.authType = authType;
    await setItem<Request>("request", theReq.id, theReq);
    return theReq;
  }
  return null;
};

export const updateAuthValueHandler = async (reqId: string, authValue: Auth["value"]) => {
  const theReq = await getItem<Request>("request", reqId);
  if (theReq) {
    theReq.auth.value = authValue;
    await setItem<Request>("request", theReq.id, theReq);
    return theReq;
  }
  return null;
};

export const updateBodyTypeHandler = async (reqId: string, bodyType: Body["type"]) => {
  const theReq = await getItem<Request>("request", reqId);
  if (theReq) {
    theReq.body.type = bodyType;
    await setItem<Request>("request", theReq.id, theReq);
    return theReq;
  }
  return null;
};

export const updateBodyValueHandler = async (reqId: string, bodyValue: Body["content"]) => {
  const theReq = await getItem<Request>("request", reqId);
  if (theReq) {
    theReq.body.content = bodyValue;
    await setItem<Request>("request", theReq.id, theReq);
    return theReq;
  }
  return null;
};
