import { RequestPrimary } from "@/db/models.type";
import { FC } from "react";

interface RequestFileProps {
  item: RequestPrimary;
}

export const RequestItem: FC<RequestFileProps> = ({ item }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="px-1 text-xs rounded bg-amber-300">{item.method.toUpperCase()}</span>
      <strong className="text-sm">{item.name}</strong>
    </div>
  );
};
