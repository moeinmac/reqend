import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MutateFolderInput } from "@/db/dal/crud-collection";
import { useCollectionStore } from "@/store/useCollectionStore";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface NewFolderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  MutateFolderInput: Omit<MutateFolderInput, "folderName">;
}

const NewFolder: FC<NewFolderProps> = ({ open, setOpen, MutateFolderInput }) => {
  const [folderName, setFolderName] = useState<string>("");
  const onNewFolderHandler = useCollectionStore((state) => state.newFolder);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Pick a name for your new folder.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} type="text" placeholder="Folder Name" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size={"sm"}
            onClick={async () => {
              const updatedCollection = await onNewFolderHandler({ ...MutateFolderInput, folderName });
              setOpen(false);
              if (updatedCollection) {
                setFolderName("");
                toast.success(`New folder '${folderName}' created successfully!`);
              }
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolder;
