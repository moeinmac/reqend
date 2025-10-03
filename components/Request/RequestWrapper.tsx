"use client";

import { useActiveReqStore } from "@/store/useActiveReqStore";
import { FC, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import Loading from "../ui/loading";
import NoActiveRequest from "./NoActiveRequest";
import RequestTabs from "./Tabs/RequestTabs";

const RequestWrapper: FC = () => {
  const activeRequests = useActiveReqStore((state) => state.activeRequests);
  const loading = useActiveReqStore((state) => state.loading);

  const { fetchAllActiveReqs } = useActiveReqStore(
    useShallow((state) => ({
      fetchAllActiveReqs: state.fetchAllActiveReqs,
    }))
  );

  useEffect(() => {
    fetchAllActiveReqs();
  }, []);

  return (
    <div className="col-span-4 mt-10 flex flex-col gap-4 ">
      {loading ? <Loading /> : activeRequests.length > 0 ? <RequestTabs tabs={activeRequests} /> : <NoActiveRequest />}
    </div>
  );
};

export default RequestWrapper;
