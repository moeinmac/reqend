import { FC } from "react";
import { Input } from "../../ui/input";

const InputReq: FC = () => {
  return (
    <div className="col-span-4 mt-10">
      <Input type="text" placeholder="Enter URL or paste text" className="py-6" />
    </div>
  );
};

export default InputReq;
