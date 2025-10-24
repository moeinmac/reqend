import { v4 } from "uuid";
import { getAllItems, getItem, removeItem, setItem } from "../db";
import { ActiveRequest } from "../models.type";

export const DEFAULT_REQ_NAME = "untitled request";
export const DEFAULT_REQ_METHOD = "get";
export const MAXIMUM_REQUEST_NAME_LENGTH = 17;

export const getAllActiveRequest = async () => {
  const allRequests = await getAllItems<ActiveRequest>("activeReq");
  return allRequests;
};

export const addTempActiveRequest = async (collectionId?: string) => {
  const tempRequest: ActiveRequest = {
    id: v4(),
    name: DEFAULT_REQ_NAME,
    method: DEFAULT_REQ_METHOD,
    type: "request",
  };
  if (collectionId) tempRequest.collectionId = collectionId;
  await setItem<ActiveRequest>("activeReq", tempRequest.id, tempRequest);
  return tempRequest;
};

export const addActiveRequest = async (activeReq: ActiveRequest) => {
  await setItem<ActiveRequest>("activeReq", activeReq.id, activeReq);
  return activeReq;
};

export const removeActiveRequest = async (reqId: string) => {
  await removeItem("activeReq", reqId);
};

export const updateActiveReqNameHandler = async (reqId: string, newName: string) => {
  const theReq = await getItem<ActiveRequest>("activeReq", reqId);
  if (theReq) {
    theReq.name = newName;
    await setItem<ActiveRequest>("activeReq", theReq.id, theReq);
  }
};

export const saveActiveReqHandler = async (reqId: string, collectionId: string) => {
  const theReq = await getItem<ActiveRequest>("activeReq", reqId);
  if (theReq) {
    theReq.collectionId = collectionId;
    await setItem<ActiveRequest>("activeReq", theReq.id, theReq);
  }
  return theReq;
};
