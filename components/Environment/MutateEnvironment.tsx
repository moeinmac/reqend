"use client";

import { useEnvStore } from "@/store/useEnvStore";
import { PencilLine } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

interface NewEnvironmentProps {
  mode: "new";
}

interface EditEnvironmentProps {
  value: string;
  environmentId: string;
  mode: "edit";
}

type MutateEnvironmentProps = NewEnvironmentProps | EditEnvironmentProps;

const MutateEnvironment: FC<MutateEnvironmentProps> = (props) => {
  const mode = props.mode;
  const [open, setOpen] = useState<boolean>(false);
  const [envInput, setEnvInput] = useState<string>(mode === "new" ? "" : props.value);

  const addNewEnv = useEnvStore((state) => state.add);
  const renameNewEnv = useEnvStore((state) => state.rename);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {mode === "new" && (
        <Button variant="outline" size={"sm"} className="ml-auto" onClick={() => setOpen(true)}>
          New Environment
        </Button>
      )}

      {mode === "edit" && (
        <Button variant="outline" disabled={props.environmentId === "global"} size={"sm"} onClick={() => setOpen(true)}>
          Rename <PencilLine size={16} className="ml-3" />
        </Button>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? `Edit Environment ${props.value}` : "New Environment"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Rename this environment and put what ever you want." : "Create a new environment to manage your variables."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input maxLength={25} value={envInput} onChange={(e) => setEnvInput(e.target.value)} type="text" placeholder="Environment Name" />
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
              const result = mode === "new" ? await addNewEnv(envInput) : await renameNewEnv(props.environmentId, envInput);
              if (result) {
                setEnvInput("");
                toast.success(
                  `${mode === "edit" ? "Environment" : "New Environment"} '${envInput}' ${mode === "edit" ? "edited" : "created"} successfully!`
                );
              }
              setOpen(false);
            }}
          >
            {mode === "edit" ? "Edit" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MutateEnvironment;
