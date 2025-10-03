"use client";

import { getAllActiveRequest } from "@/db/dal/crud-activeReq";
import { ActiveRequest } from "@/db/models.type";
import { FC, useEffect, useState } from "react";
import Request from "./Request";
import RequestTabs from "./Tabs/RequestTabs";
import Loading from "../ui/loading";
import { Spinner } from "../ui/spinner";
import { useActiveReqStore } from "@/store/useActiceReqStore";
import { useShallow } from "zustand/react/shallow";
import NoActiveRequest from "./NoActiveRequest";

const RequestWrapper: FC = () => {
  const activeRequests = useActiveReqStore((state) => state.activeRequests);
  const loading = useActiveReqStore((state) => state.loading);

  const { addActiveReq, fetchAllActiveReqs, removeActiveReq, updateActiveReq } = useActiveReqStore(
    useShallow((state) => ({
      fetchAllActiveReqs: state.fetchAllActiveReqs,
      addActiveReq: state.add,
      removeActiveReq: state.remove,
      updateActiveReq: state.update,
    }))
  );

  useEffect(() => {
    fetchAllActiveReqs();
  }, []);

  return (
    <div className="col-span-4 mt-10 flex flex-col gap-4 ">
      {loading ? <Loading /> : activeRequests.length > 0 ? <Request id="" /> : <NoActiveRequest />}
    </div>
  );
};

export default RequestWrapper;
