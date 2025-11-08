"use client";

import { FC, useEffect } from "react";
import MutateEnvironment from "./MutateEnvironment";
import { useEnvStore } from "@/store/useEnvStore";
import ActiveEnv from "./ActiveEnv";

const Environment: FC = () => {
  const fetchAllEnvs = useEnvStore((state) => state.fetchAllEnvs);
  const appMode = useEnvStore((state) => state.appMode);

  useEffect(() => {
    fetchAllEnvs();
  }, [fetchAllEnvs]);

  return (
    <div className={`${appMode === "env" ? "col-start-6 col-end-9 p-6" : "col-span-2 p-4"}`}>
      <div className="flex items-center gap-4 mb-5">
        <h3 className="font-bold">Environment Variables</h3>
        <MutateEnvironment mode="new" />
      </div>
      <ActiveEnv />
    </div>
  );
};

export default Environment;
