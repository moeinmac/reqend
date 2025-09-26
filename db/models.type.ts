export type Method = "get" | "post" | "patch" | "put" | "delete";

export interface Params {
  id: string;
  key: string;
  value: string;
  description: string;
  selected: boolean;
}

export interface TheJSON {
  [key: string]: string | number | TheJSON | string[] | number[] | TheJSON[];
}

export interface FormDataBody {
  id: string;
  key: string;
  value: string | number | File;
}

export interface Body {
  id: string;
  type: "none" | "json" | "text" | "form-data" | "urlencoded" | "binary";
  content: string | FormDataBody | TheJSON;
}

export interface Request {
  id: string;
  url: string;
  params: Params[];
  body: Body;
  auth: any;
  method: Method;
}

export type CollectionItem = Request;

export type Collection = {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  items: CollectionItem[];
};
