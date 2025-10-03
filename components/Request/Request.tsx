import { RequestPrimary } from "@/db/models.type";
import { FC } from "react";
import Options from "../Options/Options";
import InputReq from "./InputReq/InputReq";
import Methods from "./Methods/Methods";
import SendButton from "./SendButton/SendButton";

interface RequestProps {
  id: RequestPrimary["id"];
}

const Request: FC<RequestProps> = ({ id }) => {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center gap-2">
        <Methods />
        <InputReq />
        <SendButton />
      </div>
      <Options />
    </div>
  );
};

export default Request;
