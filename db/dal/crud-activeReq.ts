import { getAllItems } from "../db";
import { ActiveRequest } from "../models.type";

export const getAllActiveRequest = async () => {
  const allRequests = await getAllItems<ActiveRequest>("activeReq");
  return allRequests;
};
