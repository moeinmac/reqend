import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { ActiveRequest } from "@/db/models.type";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { Plus } from "lucide-react";
import { FC } from "react";
import Request from "../Request";
import TabItem from "./TabItem";

interface RequestTabsProps {
  tabs: ActiveRequest[];
}

const RequestTabs: FC<RequestTabsProps> = ({ tabs }) => {
  const addTempRequest = useActiveReqStore((state) => state.addTemp);
  const activeReqId = useActiveReqStore((state) => state.activeReqId);
  const setActiveReqId = useActiveReqStore((state) => state.setActiveReqId);

  return (
    <Tabs value={activeReqId} onValueChange={async (value) => setActiveReqId(value)} className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <TabsList className="p-0 h-auto bg-background gap-1">
          {tabs.map((tab) => (
            <TabItem tab={tab} key={tab.id} />
          ))}
        </TabsList>

        <Button variant={"outline"} size={"sm"} className="px-4 py-2" onClick={async () => await addTempRequest()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <Request id={tab.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RequestTabs;
