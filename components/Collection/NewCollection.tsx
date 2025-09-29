import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newCollectionHandler } from "@/db/dal/crud-collection";
import { PackagePlus } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Collection } from "@/db/models.type";

interface NewCollectionProps {
  onNewCollection: (newCollection: Collection) => void;
}

const NewCollection: FC<NewCollectionProps> = ({ onNewCollection }) => {
  const [collectionInput, setCollectionInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="link" size={"icon"} onClick={() => setOpen(true)}>
            <PackagePlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Collection</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>Easily create your own collection and manage them.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input value={collectionInput} onChange={(e) => setCollectionInput(e.target.value)} type="text" placeholder="Collection Name" />
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
              const result = await newCollectionHandler(collectionInput);
              setOpen(false);
              if (result) {
                onNewCollection(result);
                toast.success(`New collection '${collectionInput}' created successfully!`);
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

export default NewCollection;
