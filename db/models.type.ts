export type StorageName = "collection" | "request" | "activeReq";

export type Method = "get" | "post" | "patch" | "put" | "delete";

export interface Params {
  id: string;
  key: string;
  value: string;
  description: string;
  selected: boolean;
}

export type AuthType = "bearerToken" | "noAuth" | "basicAuth" | "oAuth";

export type AuthBearerValue = {
  token: string;
};

// TODO declare other auth here
export type Auth = {
  authType: AuthType;
  value: any;
};

export interface TheJSON {
  [key: string]: string | number | TheJSON | string[] | number[] | TheJSON[];
}

export interface FormData {
  id: string;
  key: string;
  value: string | number | File;
}

interface NoneBody {
  id: string;
  type: "none";
  content: null;
}

interface JsonBody {
  id: string;
  type: "json";
  content: TheJSON;
}
interface FormDataBody {
  id: string;
  type: "form-data";
  content: FormData;
}

export type Body = NoneBody | JsonBody | FormDataBody;

export interface RequestPrimary {
  id: string;
  name: string;
  method: Method;
  type: "request";
}

export interface Request extends RequestPrimary {
  url: string;
  params: Params[];
  body: Body;
  auth: Auth;
  headers: Params[];
}

export interface FolderItem {
  id: string;
  name: string;
  items: (RequestPrimary | FolderItem)[];
  type: "folder";
}

export type CollectionItem = RequestPrimary | FolderItem;

export type Collection = {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  items: CollectionItem[];
};

export interface ActiveRequest extends RequestPrimary {
  collectionId?: string;
}
