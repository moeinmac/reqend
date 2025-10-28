import { v4 as ID } from "uuid";
import { getItem, setItem } from "../db";
import { Params, Request } from "../models.type";

export const updateHeadersHandler = async (headers: Params[], reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;
  thisRequest.headers = headers;
  await setItem<Request>("request", reqId, thisRequest);
  return thisRequest;
};

export const addNewHeaderHandler = async (reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;

  const newRow: Params = {
    description: "",
    key: "",
    value: "",
    id: ID(),
    selected: false,
  };
  thisRequest.headers = [...thisRequest.headers, newRow];
  await setItem<Request>("request", reqId, thisRequest);
  return { updatedReq: thisRequest, newHeader: newRow };
};

export const removeHeaderHandler = async (id: string, reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;

  const headersAfterDelete = thisRequest.headers.filter((p) => p.id !== id);
  thisRequest.headers = headersAfterDelete;
  await setItem<Request>("request", reqId, thisRequest);

  return thisRequest;
};
