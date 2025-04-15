"use client";

import { FC } from "react";
import InputReq from "./InputReq/InputReq";
import Methods from "./Methods/Methods";
import SendButton from "./SendButton/SendButton";
import Options from "../Options/Options";

const Request: FC = () => {
  return (
    <div className="col-span-4 mt-10 flex flex-col gap-4 ">
      <form className="flex items-center gap-2">
        <Methods />
        <InputReq />
        <SendButton />
      </form>
      <Options />
    </div>
  );
};

export default Request;
