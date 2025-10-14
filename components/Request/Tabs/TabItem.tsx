import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_REQ_NAME, MAXIMUM_REQUEST_NAME_LENGTH } from "@/db/dal/crud-activeReq";
import { removeRequestHandler } from "@/db/dal/crud-request";
import { ActiveRequest } from "@/db/models.type";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { useRequestStore } from "@/store/useRequestStore";
import { Dot, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import SaveRequest from "../SaveRequest/SaveRequest";
import { useCollectionStore } from "@/store/useCollectionStore";
import { toast } from "sonner";

interface TabItemProps {
  tab: ActiveRequest;
}

const TabItem: FC<TabItemProps> = ({ tab }) => {
  const defaultRequestName = !tab.collectionId && tab.name === DEFAULT_REQ_NAME ? "" : tab.name;

  const [isHover, setIsHover] = useState<boolean>(false);
  const [input, setInput] = useState<boolean>(false);
  const [reqName, setReqName] = useState<string>(defaultRequestName);

  const [openSaveRequest, setOpenSaveRequest] = useState<boolean>(false);

  const removeActiveRequest = useActiveReqStore((state) => state.remove);
  const updateActiveReqName = useActiveReqStore((state) => state.updateName);
  const onChangeName = useRequestStore((state) => state.onChangeName);
  const updateRequestCollection = useCollectionStore((state) => state.updateRequestCollection);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && !tab.collectionId) {
        e.preventDefault();
        setOpenSaveRequest(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <TabsTrigger
        key={tab.id}
        value={tab.id}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="border max-w-[208px] px-4 py-2 border-transparent data-[state=active]:border-border data-[state=active]:shadow-none"
      >
        {!input && (
          <code onDoubleClick={() => setInput(true)} className="text-[13px]">
            {tab.name}
          </code>
        )}
        {input && (
          <Input
            className="rounded-sm h-auto py-0"
            onBlur={async () => {
              if (reqName.trim().length > 0 && reqName !== tab.name) {
                if (reqName.length > MAXIMUM_REQUEST_NAME_LENGTH) {
                  toast.error(`Request name can not be longer that ${MAXIMUM_REQUEST_NAME_LENGTH}`);
                  setReqName(tab.name);
                } else {
                  await updateActiveReqName(tab.id, reqName);
                  await onChangeName(reqName);
                  if (tab.collectionId) await updateRequestCollection(tab.collectionId!, tab.id, { name: reqName });
                }
              }
              setInput(false);
            }}
            value={reqName}
            autoFocus
            onChange={(event) => setReqName(event.target.value)}
          />
        )}
        {!tab.collectionId && !input && <Dot className="w-5 h-5 ml-2" />}
        {isHover && !input && (
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
            <X className="ml-2 w-2 h-2" />
          </Button>
        )}
      </TabsTrigger>
      <SaveRequest open={openSaveRequest} setOpen={(open) => setOpenSaveRequest(open)} />
    </>
  );
};

export default TabItem;
