"use client";

import Environment from "@/components/Environment/Environment";
import EnvironmentWrapper from "@/components/Environment/EnvironmentWrapper";

const EnvironmentPage = () => {
  return (
    <div className="grid grid-cols-8 gap-2">
      <EnvironmentWrapper />
      <Environment variant="expanded" />
    </div>
  );
};

export default EnvironmentPage;
