import { RequestPrimary, Request as RequestType } from "@/db/models.type";
import { FC, useEffect } from "react";
import Options from "../Options/Options";
import InputReq from "./InputReq/InputReq";
import Methods from "./Methods/Methods";
import SendButton from "./SendButton/SendButton";
import { useRequestStore } from "@/store/useRequestStore";
import Loading from "../ui/loading";

interface RequestProps {
  id: RequestPrimary["id"];
}

const Request: FC<RequestProps> = ({ id }) => {
  const isFetched = useRequestStore((state) => state.fetched);
  const fetchRequest = useRequestStore((state) => state.fetchRequest);

  useEffect(() => {
    if (!isFetched) fetchRequest(id);
  }, []);

  if (!isFetched) return <Loading />;

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
