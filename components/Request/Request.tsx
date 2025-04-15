import { FC } from "react";
import InputReq from "./InputReq/InputReq";
import Methods from "./Methods/Methods";

const Request: FC = () => {
  return (
    <div className="col-span-4 mt-10 flex items- gap-2  ">
      <Methods />
      <InputReq />
    </div>
  );
};

export default Request;
