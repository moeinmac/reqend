import { FC } from "react";
import { Input } from "../../ui/input";
import { useRequestStore } from "@/store/useRequestStore";

const InputReq: FC = () => {
  const reqUrl = useRequestStore((state) => state.request?.url) ?? "";
  const onChange = useRequestStore((state) => state.onChangeUrl);
  return (
    <Input
      type="text"
      name="url"
      value={reqUrl}
      onChange={async (event) => await onChange(event.target.value)}
      placeholder="Enter URL or paste text"
      className="py-6 w-full"
    />
  );
};

export default InputReq;
