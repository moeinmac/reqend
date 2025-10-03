import { v4 } from "uuid";
import { setItem } from "../db";
import { Request } from "../models.type";

export const newRequestHandler = async (newReq: Omit<Request, "id"> & { id?: string }) => {
  const newRequest: Request = {
    ...newReq,
    id: newReq.id ?? v4(),
  };
  await setItem<Request>("request", newRequest.id, newRequest);
  return newRequest;
};
