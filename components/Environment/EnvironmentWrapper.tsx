import { useEnvStore } from "@/store/useEnvStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import EnvTable from "./EnvTable";

const EnvironmentWrapper: FC = () => {
  const { activeId, envs } = useEnvStore(useShallow((state) => ({ envs: state.envs, activeId: state.activeEnvId })));

  const activeEnv = envs.find((env) => env.id === activeId)!;

  return (
    <div className="flex flex-col gap-4 col-span-5 p-6">
      <h1 className="font-black text-4xl">Environment -::- {`${activeEnv ? activeEnv.name : "N/A"}`}</h1>
      <p>
        "They store config and secrets outside the API so the same app can behave differently in each environment and project — like giving it a new
        costume for every show. {activeEnv?.id === "global" ? "(Global Environment can not be deleted or renamed)" : ""}"
      </p>
      {activeEnv && <EnvTable />}
    </div>
  );
};

export default EnvironmentWrapper;
