"use client";

import { getAllActiveRequest } from "@/db/dal/crud-activeReq";
import { ActiveRequest } from "@/db/models.type";
import { FC, useEffect, useState } from "react";
import Request from "./Request";
import RequestTabs from "./Tabs/RequestTabs";

const RequestWrapper: FC = () => {
  const [activeRequests, setActiveRequest] = useState<ActiveRequest[] | null>(null);

  useEffect(() => {
    const fetchAllRequests = async () => {
      const allRequests = await getAllActiveRequest();
      if (allRequests) setActiveRequest(allRequests);
    };
    fetchAllRequests();
  }, []);

  return (
    <div className="col-span-4 mt-10 flex flex-col gap-4 ">
      <RequestTabs />
      <Request id="" />
    </div>
  );
};

export default RequestWrapper;
