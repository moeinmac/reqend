import { LocalStoragePreset } from "lowdb/browser";
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

export const db = typeof window !== "undefined" ? LocalStoragePreset("db", defaultData) : undefined;
