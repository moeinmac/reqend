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
      {activeEnv && <EnvTable />}
    </div>
  );
};

export default EnvironmentWrapper;
