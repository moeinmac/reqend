export interface Params {
  id: string;
  key: string;
  value: string;
  description: string;
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
  body: TheJSON | FormDataBody[];
}

export interface Request {
  id: string;
  url: string;
  params: Params["id"][];
  body: Body["id"][];
}
