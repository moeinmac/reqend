"use client";

import { useEnvStore } from "@/store/useEnvStore";
import { FC, useEffect } from "react";
import ActiveEnv from "./ActiveEnv";
import MutateEnvironment from "./MutateEnvironment";

type EnvironmentProps = {
  variant?: "compact" | "expanded";
};

const Environment: FC<EnvironmentProps> = ({ variant = "compact" }) => {
  const fetchAllEnvs = useEnvStore((state) => state.fetchAllEnvs);

  useEffect(() => {
    fetchAllEnvs();
  }, [fetchAllEnvs]);

  return (
    <div className={variant === "expanded" ? "col-span-3 p-6" : "col-span-2 p-4"}>
      <div className="flex items-center gap-4 mb-5">
        <h3 className="font-bold">Environment Variables</h3>
        <MutateEnvironment mode="new" />
      </div>
      <ActiveEnv variant={variant} />
    </div>
  );
};

export default Environment;
