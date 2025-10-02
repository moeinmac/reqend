export type StorageName = "collection" | "request" | "activeReq";

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
  auth: any;
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
