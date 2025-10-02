import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newFolderHandler, NewFolderInput } from "@/db/dal/crud-collection";
import { Collection } from "@/db/models.type";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface NewFolderProps {
  onNewFolder: (newCollection: Collection) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  newFolderInput: Omit<NewFolderInput, "folderName">;
}

const NewFolder: FC<NewFolderProps> = ({ onNewFolder, open, setOpen, newFolderInput }) => {
  const [folderName, setFolderName] = useState<string>("");
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
              const updatedCollection = await newFolderHandler({ ...newFolderInput, folderName });
              setOpen(false);
              if (updatedCollection) {
                setFolderName("");
                onNewFolder(updatedCollection);
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
