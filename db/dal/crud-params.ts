import { db } from "..";
import { getItem, setItem } from "../db";
import { Params, Request } from "../models.type";
import { v4 as ID } from "uuid";

export const updateParamsHandler = async (params: Params[], reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;
  thisRequest.params = params;
  await setItem<Request>("request", reqId, thisRequest);
  return thisRequest;
};

export const addNewParamsHandler = async (reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;

  const newRow: Params = {
    description: "",
    key: "",
    value: "",
    id: ID(),
    selected: false,
  };
  thisRequest.params = [...thisRequest.params, newRow];
  await setItem<Request>("request", reqId, thisRequest);
  return { updatedReq: thisRequest, newParam: newRow };
};

export const removeParamHandler = async (id: string, reqId: string) => {
  const thisRequest = await getItem<Request>("request", reqId);
  if (!thisRequest) return;

  const paramsAfterDelete = thisRequest.params.filter((p) => p.id !== id);
  thisRequest.params = paramsAfterDelete;
  await setItem<Request>("request", reqId, thisRequest);

  return thisRequest;
};
