"use client";

import { useEnvStore } from "@/store/useEnvStore";
import { Delete, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import ChangeEnv from "./ChangeEnv";
import MutateEnvironment from "./MutateEnvironment";

type ActiveEnvProps = {
  variant?: "compact" | "expanded";
};

const ActiveEnv: FC<ActiveEnvProps> = ({ variant = "compact" }) => {
  const { envList, activeEnvId, removeEnv } = useEnvStore(
    useShallow((state) => ({
      envList: state.envs,
      activeEnvId: state.activeEnvId,
      removeEnv: state.remove,
    })),
  );

  const selectedActiveEnv = envList.find((env) => env.id === activeEnvId);
  const isExpanded = variant === "expanded";

  return (
    <div className="flex flex-col gap-2">
      {envList.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
          <ChangeEnv envList={envList.map((env) => ({ title: env.name, value: env.id }))} activeEnvId={activeEnvId} />
          {selectedActiveEnv && !isExpanded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild>
                  <Link href="/environment">
                    <ExternalLink size={16} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open {`'${selectedActiveEnv.name}'`}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {isExpanded && (
            <Button asChild>
              <Link href="/request">
                Collections <ExternalLink className="ml-2" size={16} />
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No environment variables found. Please create one.</p>
      )}
      {envList.length > 0 && selectedActiveEnv && isExpanded && (
        <div className="flex mt-4 gap-4 ml-auto flex-col">
          <MutateEnvironment mode="edit" environmentId={selectedActiveEnv.id} value={selectedActiveEnv.name} />

          <Button
            disabled={selectedActiveEnv.id === "global"}
            variant="outline"
            size={"sm"}
            onClick={async () => await removeEnv(selectedActiveEnv.id)}
          >
            Delete <Delete className="ml-3" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActiveEnv;
