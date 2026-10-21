"use client";

import Environment from "@/components/Environment/Environment";
import RequestWrapper from "@/components/Request/RequestWrapper";
import Sidebar from "@/components/Sidebar/Sidebar";

const RequestPage = () => {
  return (
    <div className="grid grid-cols-8 gap-2">
      <Sidebar mode="sidebar" />
      <RequestWrapper />
      <Environment variant="compact" />
    </div>
  );
};

export default RequestPage;
