import { v4 } from "uuid";
import { getItem, removeItem, setItem } from "../db";
import type { Request } from "../models.type";

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
