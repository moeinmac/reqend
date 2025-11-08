import { useEnvStore } from "@/store/useEnvStore";
import { FC, use } from "react";
import { useShallow } from "zustand/react/shallow";

const EnvironmentWrapper: FC = () => {
  const { activeId, envs, changeAppMode } = useEnvStore(
    useShallow((state) => ({ envs: state.envs, activeId: state.activeEnvId, changeAppMode: state.changeAppMode }))
  );

  const activeEnv = envs.find((env) => env.id === activeId)!;

  return (
    <div className="flex flex-col gap-4 col-span-5 p-6">
      <h1 className="font-black text-4xl">Environment -::- {`${activeEnv ? activeEnv.name : "N/A"}`}</h1>
    </div>
  );
};

export default EnvironmentWrapper;
