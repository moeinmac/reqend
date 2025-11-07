import { useEnvStore } from "@/store/useEnvStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import ChangeEnv from "./ChangeEnv";

const ActiveEnv: FC = () => {
  const { envList, activeEnvId } = useEnvStore(useShallow((state) => ({ envList: state.envs, activeEnvId: state.activeEnvId })));

  return (
    <div>
      {envList.length > 0 && <ChangeEnv envList={envList.map((env) => ({ title: env.name, value: env.id }))} activeEnvId={activeEnvId} />}
      {envList.length === 0 && <p className="text-sm text-muted-foreground">No environment variables found. Please create one.</p>}
    </div>
  );
};

export default ActiveEnv;
