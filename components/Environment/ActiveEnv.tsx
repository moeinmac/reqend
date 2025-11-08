import { useEnvStore } from "@/store/useEnvStore";
import { Delete, ExternalLink } from "lucide-react";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ChangeEnv from "./ChangeEnv";
import MutateEnvironment from "./MutateEnvironment";

const ActiveEnv: FC = () => {
  const { envList, activeEnvId, removeEnv, changeAppMode, appMode } = useEnvStore(
    useShallow((state) => ({
      envList: state.envs,
      activeEnvId: state.activeEnvId,
      removeEnv: state.remove,
      changeAppMode: state.changeAppMode,
      appMode: state.appMode,
    }))
  );

  const selectedActiveEnv = envList.find((env) => env.id === activeEnvId);

  return (
    <div className="flex flex-col gap-2">
      {envList.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <ChangeEnv envList={envList.map((env) => ({ title: env.name, value: env.id }))} activeEnvId={activeEnvId} />
          {selectedActiveEnv && appMode === "request" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => changeAppMode("env")}>
                  <ExternalLink size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open {`'${selectedActiveEnv.name}'`}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {appMode === "env" && (
            <Button onClick={() => changeAppMode("request")}>
              Collections <ExternalLink className="ml-2" size={16} />
            </Button>
          )}
        </div>
      )}
      {envList.length === 0 && <p className="text-sm text-muted-foreground">No environment variables found. Please create one.</p>}
      {envList.length > 0 && selectedActiveEnv && (
        <div className="flex flex-col mt-4 gap-4  p-4 border border-border rounded-md">
          <p>{selectedActiveEnv.items.length} variable exits in this environment</p>
          <div className="flex items-center gap-2 justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <MutateEnvironment mode="edit" environmentId={selectedActiveEnv.id} value={selectedActiveEnv.name} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete {`'${selectedActiveEnv.name}'`} Environment</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"sm"} onClick={async () => await removeEnv(selectedActiveEnv.id)}>
                  <Delete size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete {`'${selectedActiveEnv.name}'`} Environment</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveEnv;
