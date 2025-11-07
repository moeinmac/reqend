"use client";

import { FC, useEffect } from "react";
import MutateEnvironment from "./MutateEnvironment";
import { useEnvStore } from "@/store/useEnvStore";
import ActiveEnv from "./ActiveEnv";

const Environment: FC = () => {
  const fetchAllEnvs = useEnvStore((state) => state.fetchAllEnvs);

  useEffect(() => {
    fetchAllEnvs();
  }, [fetchAllEnvs]);

  return (
    <div className="col-span-2 p-4">
      <div className="flex items-center gap-4 mb-3">
        <h3 className="font-bold">Environment Variables</h3>
        <MutateEnvironment mode="new" />
      </div>
      <ActiveEnv />
    </div>
  );
};

export default Environment;
