import { Button } from "@/components/ui/button";
import { TabsTrigger } from "@/components/ui/tabs";
import { ActiveRequest } from "@/db/models.type";
import { Dot, X } from "lucide-react";
import { FC, useState } from "react";

interface TabItemProps {
  tab: ActiveRequest;
}

const TabItem: FC<TabItemProps> = ({ tab }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <TabsTrigger
      key={tab.id}
      value={tab.id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="border px-4 py-2 border-transparent data-[state=active]:border-border data-[state=active]:shadow-none"
    >
      <code className="text-[13px]">{tab.name}</code>
      {!tab.collectionId && <Dot className="w-5 h-5 ml-2" />}
      {isHover && (
        <Button variant={"outline"} size={"sm"} className="p-1 h-5 w-5">
          <X className="w-2 h-2" />
        </Button>
      )}
    </TabsTrigger>
  );
};

export default TabItem;
