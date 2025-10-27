import { Body as BodyInterFace } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import BodyType from "./BodyType";
import JsonEditor from "./JsonEditor";

const Body: FC = () => {
  const { updateBodyType, request, updateBodyValue } = useRequestStore(
    useShallow((state) => ({
      updateBodyType: state.updateBodyType,
      request: state.request,
      updateBodyValue: state.updateBodyValue,
    }))
  );
  const bodyType: BodyInterFace["type"] = request?.body?.type ?? "none";
  const bodyValue: BodyInterFace["content"] = request?.body?.content ?? null;

  return (
    <div className="flex flex-col gap-4">
      <BodyType value={bodyType} updateBodyType={updateBodyType} />
      {bodyType === "json" ? <JsonEditor initialValue={bodyValue} onChange={async (value) => await updateBodyValue(value)} /> : ""}
    </div>
  );
};

export default Body;
