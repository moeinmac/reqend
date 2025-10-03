import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveRequest } from "@/db/models.type";
import { Dot, Plus, X } from "lucide-react";
import { FC, use, useState } from "react";
import Request from "../Request";
import TabItem from "./TabItem";

interface RequestTabsProps {
  tabs: ActiveRequest[];
  onAddTab?: () => void;
}

const RequestTabs: FC<RequestTabsProps> = ({ tabs }) => {
  const [tab, setTab] = useState<ActiveRequest["id"]>(tabs[0]?.id || "");

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)} className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <TabsList className="p-0 h-auto bg-background gap-1">
          {tabs.map((tab) => (
            <TabItem tab={tab} key={tab.id} />
          ))}
        </TabsList>

        <Button variant={"outline"} size={"sm"} className="px-4 py-2">
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
