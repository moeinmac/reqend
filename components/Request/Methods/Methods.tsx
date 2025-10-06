"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { methodsColor } from "@/constant/methodsColor";
import { DEFAULT_REQ_METHOD } from "@/db/dal/crud-activeReq";
import { type Method } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";

const Methods = () => {
  const method = useRequestStore((state) => state.request?.method) ?? DEFAULT_REQ_METHOD;
  const onChange = useRequestStore((state) => state.onChangeMethod);

  return (
    <Select name="method" value={method} onValueChange={async (value: Method) => await onChange(value)}>
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
