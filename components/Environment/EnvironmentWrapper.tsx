import { useEnvStore } from "@/store/useEnvStore";
import { FC, use } from "react";
import { useShallow } from "zustand/react/shallow";

const EnvironmentWrapper: FC = () => {
  const { activeId, envs, changeAppMode } = useEnvStore(
    useShallow((state) => ({ envs: state.envs, activeId: state.activeEnvId, changeAppMode: state.changeAppMode }))
  );

  const activeEnv = envs.find((env) => env.id === activeId)!;

  return <div className="col-span-4 row-start-2 mt-10 flex flex-col gap-4 "></div>;
};

export default EnvironmentWrapper;
