"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { methodsColor } from "@/constant/methodsColor";
import { DEFAULT_REQ_METHOD } from "@/db/dal/crud-activeReq";
import { type Method } from "@/db/models.type";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useRequestStore } from "@/store/useRequestStore";
import { FC, use } from "react";
import { useShallow } from "zustand/react/shallow";

interface MethodsProps {
  collectionId?: string;
}

const Methods: FC<MethodsProps> = ({ collectionId }) => {
  const { method, onChange, requestId } = useRequestStore(
    useShallow((state) => ({
      method: state.request?.method ?? DEFAULT_REQ_METHOD,
      onChange: state.onChangeMethod,
      requestId: state.request?.id,
    }))
  );

  const updateRequestCollection = useCollectionStore((state) => state.updateRequestCollection);

  return (
    <Select
      name="method"
      value={method}
      onValueChange={async (value: Method) => {
        await onChange(value);
        if (collectionId) await updateRequestCollection(collectionId, requestId!, { method: value });
      }}
    >
      <SelectTrigger className={"w-[105px] py-6"} style={{ color: `${methodsColor[method]}` }}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Methods</SelectLabel>
          <SelectItem value="get">GET</SelectItem>
          <SelectItem value="post">POST</SelectItem>
          <SelectItem value="put">PUT</SelectItem>
          <SelectItem value="patch">PATCH</SelectItem>
          <SelectItem value="delete">DELETE</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Methods;
