"use client";

import { FC } from "react";
import InputReq from "./InputReq/InputReq";
import Methods from "./Methods/Methods";
import SendButton from "./SendButton/SendButton";

const Request: FC = () => {
  return (
    <form className="col-span-4 mt-10 flex items- gap-2 ">
      <Methods />
      <InputReq />
      <SendButton />
    </form>
  );
};

export default Request;
