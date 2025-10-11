import { FC } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import emptyBox from "@/app/assets/emptyBox.json";

import Lottie from "lottie-react";

import { useActiveReqStore } from "@/store/useActiveReqStore";

const NoActiveRequest: FC = () => {
  const addTempRequest = useActiveReqStore((state) => state.addTemp);
  return (
    <Card className="flex flex-col gap-4 items-center justify-center p-10">
      <h1 className="text-3xl font-bold">No Active Requests</h1>
      <p>Please create a new request or collection or choose from your existing ones.</p>
      <div className="flex gap-4 mt-6">
        <Button onClick={async () => await addTempRequest()} variant={"default"}>
          Create New Request
        </Button>
        <Button variant={"outline"}>Create New Collection</Button>
      </div>
      <div className="w-80 2xl:w-96 relative aspect-square">
        <Lottie animationData={emptyBox} loop={false} />
      </div>
    </Card>
  );
};

export default NoActiveRequest;
