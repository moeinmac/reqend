"use client";

import { useActiveReqStore } from "@/store/useActiceReqStore";
import { FC, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import Loading from "../ui/loading";
import NoActiveRequest from "./NoActiveRequest";
import RequestTabs from "./Tabs/RequestTabs";

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
      {loading ? (
        <Loading />
      ) : activeRequests.length > 0 ? (
        <RequestTabs
          tabs={[
            { id: "sdfsdfsd", type: "request", method: "get", name: "sss" },
            { id: "ddddd", type: "request", method: "get", name: "rrrr" },
          ]}
        />
      ) : (
        <NoActiveRequest />
      )}
    </div>
  );
};

export default RequestWrapper;
