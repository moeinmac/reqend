import { FC } from "react";
import MutateEnvironment from "./MutateEnvironment";

const Environment: FC = () => {
  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4 mb-3">
        <h3 className="font-bold">Environment Variables</h3>
        <MutateEnvironment mode="new" />
      </div>
    </div>
  );
};

export default Environment;
