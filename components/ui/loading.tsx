import { FC } from "react";
import { Spinner } from "./spinner";

const Loading: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Spinner variant="bars" className="w-10 h-10" />
      Please Wait...
    </div>
  );
};

export default Loading;
