import { v4 } from "uuid";
import { getAllItems, removeItem, setItem } from "../db";
import { ActiveRequest } from "../models.type";

export const getAllActiveRequest = async () => {
  const allRequests = await getAllItems<ActiveRequest>("activeReq");
  return allRequests;
};

export const addTempActiveRequest = async () => {
  const tempRequest: ActiveRequest = {
    id: v4(),
    name: "untitled request",
    method: "get",
    type: "request",
  };
  await setItem<ActiveRequest>("activeReq", tempRequest.id, tempRequest);
  return tempRequest;
};

export const removeActiveRequest = async (reqId: string) => {
  await removeItem("activeReq", reqId);
};
