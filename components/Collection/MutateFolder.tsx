import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MutateFolderInput } from "@/db/dal/crud-collection";
import { useCollectionStore } from "@/store/useCollectionStore";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";

export interface MutateFolderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mutateFolderInput: Omit<MutateFolderInput, "folderName"> & { folderName?: string };
  mode: "create" | "rename";
}

const MutateFolder: FC<MutateFolderProps> = ({ open, setOpen, mutateFolderInput, mode }) => {
  const [folderName, setFolderName] = useState<string>(mutateFolderInput.folderName ?? "");
  const onNewFolderHandler = useCollectionStore((state) => state.newFolder);
  const onRenameFolderHandler = useCollectionStore((state) => state.renameFolder);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${mode === "create" ? "New" : "Rename"}`} Folder</DialogTitle>
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
              const updatedCollection =
                mode === "rename"
                  ? await onRenameFolderHandler({ ...mutateFolderInput, folderName })
                  : await onNewFolderHandler({ ...mutateFolderInput, folderName });
              setOpen(false);
              if (updatedCollection) {
                setFolderName("");
                toast.success(`New folder '${folderName}' created successfully!`);
              }
            }}
          >
            {mode === "create" ? "Create" : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MutateFolder;
