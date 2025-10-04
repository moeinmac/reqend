import { FC } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import newIdea from "@/app/assets/new.svg";
import Image from "next/image";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { newRequestHandler } from "@/db/dal/crud-request";
import { useRequestStore } from "@/store/useRequestStore";

const NoActiveRequest: FC = () => {
  const addTempRequest = useActiveReqStore((state) => state.addTemp);
  const fetchRequest = useRequestStore((state) => state.fetchRequest);
  return (
    <Card className="flex flex-col gap-4 items-center justify-center p-10">
      <h1 className="text-3xl font-bold">No Active Requests</h1>
      <p>Please create a new request or collection or choose from your existing ones.</p>
      <div className="flex gap-4 mt-6">
        <Button
          onClick={async () => {
            const { id: tempReqId, name: tempReqName } = await addTempRequest();
            await newRequestHandler({
              id: tempReqId,
              name: tempReqName,
              method: "get",
              url: "",
              body: null,
              params: [],
              auth: null,
              type: "request",
            });
            await fetchRequest(tempReqId);
          }}
          variant={"default"}
        >
          Create New Request
        </Button>
        <Button variant={"outline"}>Create New Collection</Button>
      </div>
      <div className="w-80 2xl:w-96 relative aspect-square">
        <Image src={newIdea} alt="new idea" fill />
      </div>
    </Card>
  );
};

export default NoActiveRequest;
