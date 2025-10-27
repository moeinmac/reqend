import { Body as BodyInterFace } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import BodyType from "./BodyType";
import JsonEditor from "./JsonEditor";

const Body: FC = () => {
  const request = useRequestStore((state) => state.request);
  const bodyType: BodyInterFace["type"] = request?.body?.type ?? "none";
  const bodyValue: BodyInterFace["content"] = request?.body?.content ?? null;

  return (
    <div className="flex flex-col gap-4">
      <BodyType value={bodyType} />
      {bodyType === "json" ? <JsonEditor initialValue={undefined} /> : ""}
    </div>
  );
};

export default Body;
