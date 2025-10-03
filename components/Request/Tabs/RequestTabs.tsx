import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveRequest } from "@/db/models.type";
import { Plus } from "lucide-react";
import { FC, useState } from "react";
import Request from "../Request";

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
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="border px-4 py-2 border-transparent data-[state=active]:border-border data-[state=active]:shadow-none"
            >
              <code className="text-[13px]">{tab.name}</code>
            </TabsTrigger>
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
