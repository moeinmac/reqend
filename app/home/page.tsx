"use client";

import Environment from "@/components/Environment/Environment";
import EnvironmentWrapper from "@/components/Environment/EnvironmentWrapper";
import EnvSidebar from "@/components/Environment/EnvSidebar";
import RequestWrapper from "@/components/Request/RequestWrapper";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEnvStore } from "@/store/useEnvStore";

const Home = () => {
  const appMode = useEnvStore((state) => state.appMode);

  return (
    <div className="grid grid-cols-8 gap-2">
      {appMode === "request" ? <Sidebar mode="sidebar" /> : <EnvSidebar />}
      {appMode === "request" ? <RequestWrapper /> : <EnvironmentWrapper />}
      <Environment />
    </div>
  );
};

export default Home;
