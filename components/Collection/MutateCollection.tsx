import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCollectionStore } from "@/store/useCollectionStore";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

interface NewCollectionProps {
  mode: "new";
}

interface EditCollectionProps {
  value: string;
  collectionId: string;
  mode: "edit";
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

type MutateCollectionProps = NewCollectionProps | EditCollectionProps;

const MutateCollection: FC<MutateCollectionProps> = (props) => {
  const mode = props.mode;
  const [collectionInput, setCollectionInput] = useState<string>(mode === "new" ? "" : props.value);
  const [inlineOpen, setInlineOpen] = useState<boolean>(false);

  const { onRenameCollection, onAddCollection } = useCollectionStore(
    useShallow((state) => ({
      onAddCollection: state.addCollection,
      onRenameCollection: state.renameCollection,
    }))
  );

  return (
    <Dialog open={mode === "edit" ? props.open : inlineOpen} onOpenChange={mode === "edit" ? props.setOpen : setInlineOpen}>
      {mode === "new" && (
        <Button variant="secondary" size={"sm"} className="ml-auto" onClick={() => setInlineOpen(true)}>
          New Collection
        </Button>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? `Edit Collection ${props.value}` : "New Collection"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Rename this collection and put what ever you want." : "Easily create your own collection and manage them."}
          </DialogDescription>
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
              const result = mode === "edit" ? await onRenameCollection(props.collectionId, collectionInput) : await onAddCollection(collectionInput);

              mode === "edit" ? props.setOpen(false) : setInlineOpen(false);

              if (result) {
                setCollectionInput("");
                toast.success(
                  `${mode === "edit" ? "Collection" : "New collection"} '${collectionInput}' ${mode === "edit" ? "edited" : "created"} successfully!`
                );
              }
            }}
          >
            {props.mode === "edit" ? "Edit" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MutateCollection;
