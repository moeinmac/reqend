import { db } from "..";
import { Params } from "../models.type";
import { v4 as ID } from "uuid";

export const writeParams = (params: Params[]) => {
  db!.data.params = params;
  db!.write();
};

export const addNewParams = () => {
  const newRow: Params = {
    description: "",
    key: "",
    value: "",
    id: ID(),
    selected: false,
  };
  db!.data.params.push(newRow);
  db!.write();
  return newRow;
};

export const removeParam = (id: string) => {
  const paramsAfterDelete = db!.data.params.filter((p) => p.id !== id);
  db!.data.params = paramsAfterDelete;
  db!.write();
  return paramsAfterDelete;
};
