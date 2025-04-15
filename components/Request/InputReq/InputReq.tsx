import { FC } from "react";
import { Input } from "../../ui/input";

const InputReq: FC = () => {
  return <Input type="text" placeholder="Enter URL or paste text" className="py-6 w-full" />;
};

export default InputReq;
