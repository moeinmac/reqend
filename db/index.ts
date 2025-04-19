import { JSONFilePreset } from "lowdb/node";
import { Body, Params, Request } from "./models.type";

export interface DataBase {
  request: Request[];
  params: Params[];
  body: Body[];
}

const defaultData: DataBase = {
  body: [],
  params: [],
  request: [],
};

export const db = await JSONFilePreset("db.json", defaultData);
