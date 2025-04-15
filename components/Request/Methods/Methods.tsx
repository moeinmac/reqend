"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { methodsColor } from "@/constant/methodsColor";
import { useState } from "react";

const Methods = () => {
  const [method, setMethod] = useState<keyof typeof methodsColor>("get");
  console.log(`text-[${methodsColor[method]}]`);

  return (
    <Select
      value={method}
      onValueChange={(value: keyof typeof methodsColor) => {
        console.log(value, "value");

        setMethod(value);
      }}
    >
      <SelectTrigger className={`w-[105px] py-6`} style={{ color: `${methodsColor[method]}` }}>
        <SelectValue placeholder="GET" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Methods</SelectLabel>
          <SelectItem value="get">GET</SelectItem>
          <SelectItem value="post">POST</SelectItem>
          <SelectItem value="put">PUT</SelectItem>
          <SelectItem value="patch">PATCH</SelectItem>
          <SelectItem value="delete">DETELE</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Methods;
