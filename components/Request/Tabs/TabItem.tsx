import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsTrigger } from "@/components/ui/tabs";
import { removeRequestHandler } from "@/db/dal/crud-request";
import { ActiveRequest } from "@/db/models.type";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { Dot, X } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface TabItemProps {
  tab: ActiveRequest;
}

const TabItem: FC<TabItemProps> = ({ tab }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [input, setInput] = useState<boolean>(false);
  const [reqName, setReqName] = useState<string>(!tab.collectionId ? "" : tab.name);

  const removeActiveRequest = useActiveReqStore((state) => state.remove);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        console.log("Save shortcut triggered");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <TabsTrigger
      key={tab.id}
      value={tab.id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="border px-4 py-2 border-transparent data-[state=active]:border-border data-[state=active]:shadow-none"
    >
      {!input && (
        <code onDoubleClick={() => setInput(true)} className="text-[13px]">
          {tab.name}
        </code>
      )}
      {input && (
        <Input
          className="rounded-sm h-auto py-0"
          onBlur={() => setInput(false)}
          value={reqName}
          autoFocus
          onChange={(event) => setReqName(event.target.value)}
        />
      )}
      {!tab.collectionId && <Dot className="w-5 h-5 ml-2" />}
      {isHover && (
        <Button
          asChild
          variant={"outline"}
          size={"sm"}
          className="p-1 h-5 w-5"
          onClick={async () => {
            await removeActiveRequest(tab.id);
            if (!tab.collectionId) await removeRequestHandler(tab.id);
          }}
        >
          <X className="w-2 h-2" />
        </Button>
      )}
    </TabsTrigger>
  );
};

export default TabItem;
