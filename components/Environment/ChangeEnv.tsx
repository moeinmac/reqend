"use client";

import { Check, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEnvStore } from "@/store/useEnvStore";
import { FC, useState } from "react";
import { toast } from "sonner";

interface ChangeEnvProps {
  envList: { value: string; title: string }[];
  activeEnvId: string;
}

const ChangeEnv: FC<ChangeEnvProps> = ({ activeEnvId, envList }) => {
  const [open, setOpen] = useState(false);

  const changeActiveEnv = useEnvStore((state) => state.changeActiveEnv);

  const activeEnv = envList.find((env) => env.value === activeEnvId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[300px] justify-between">
          {activeEnv ? activeEnv.title : "Select Environment..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] flex p-0">
        <Command loop>
          <CommandInput placeholder="Search Environment..." />
          <CommandList>
            <CommandEmpty>No environment found.</CommandEmpty>
            <CommandGroup>
              {envList.map((env) => (
                <CommandItem
                  keywords={[env.title]}
                  key={env.value}
                  value={env.value}
                  onSelect={(currentValue) => {
                    if (currentValue === "global" && currentValue === activeEnvId) return toast.error("can't deActive global environment");
                    changeActiveEnv(currentValue === activeEnvId ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {env.title}
                  <Check className={cn("ml-auto", activeEnv?.value === env.value || env?.value === "global" ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChangeEnv;
