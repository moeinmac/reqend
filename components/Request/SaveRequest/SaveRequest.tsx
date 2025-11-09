import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActiveReqStore } from "@/store/useActiveReqStore";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useRequestStore } from "@/store/useRequestStore";
import { FC, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

interface SaveRequestProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SaveRequest: FC<SaveRequestProps> = ({ open, setOpen }) => {
  const { fetched, request } = useRequestStore(
    useShallow((state) => ({
      request: state.request,
      fetched: state.fetched,
    }))
  );

  const { thisActiveReq } = useActiveReqStore(
    useShallow((state) => ({
      thisActiveReq: state.activeRequests.find((req) => req.id === state.activeReqId),
    }))
  );

  const collections = useCollectionStore((state) => state.collections);

  useEffect(() => {
    if (thisActiveReq?.collectionId) setOpen(false);
  }, [thisActiveReq]);

  if (!fetched || !request)
    return (
      <Dialog open={open} modal={false} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Couldn't Save the request</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Reqend have some problems with saving this request or maybe this request data is broken. try again later
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size={"sm"}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={open} modal={false} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save This Request</DialogTitle>
          <DialogDescription>
            {collections.length === 0
              ? "First Create a collection with 'New Collection' and then try to save this request"
              : "Pick a collection and save your request to the desired path."}
          </DialogDescription>
        </DialogHeader>
        {collections.length > 0 && (
          <div>
            <Sidebar mode="treeview" />
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveRequest;
