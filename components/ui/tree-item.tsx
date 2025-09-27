import { FC, useState } from "react";
import { Input } from "./input";

interface TreeItemProps {
  initialInput?: true;
  value: string;
}

const TreeItem: FC<TreeItemProps> = ({ initialInput, value }) => {
  const [isInput, setIsInput] = useState<boolean>(initialInput ?? false);

  return isInput ? (
    <Input defaultValue={value} className="py-0  h-6 rounded-sm leading-" onBlur={() => setIsInput(false)} />
  ) : (
    <span onDoubleClick={() => setIsInput(true)}>{value}</span>
  );
};

export default TreeItem;
