import { temp } from "@/lib/folderTreeGenerator";
import { FC } from "react";
import { Tree, TreeViewElement } from "../ui/file-tree";
import { FolderTree } from "./FolderTree";

const ELEMENTS: TreeViewElement[] = [
  {
    id: "root",
    isSelectable: true,
    name: "src",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "app",
        children: [
          {
            id: "3",
            isSelectable: true,
            name: "layout.tsx",
          },
          {
            id: "4",
            isSelectable: false,
            name: "page.tsx",
          },
        ],
      },
      {
        id: "5",
        isSelectable: true,
        name: "components",
        children: [
          {
            id: "6",
            isSelectable: true,
            name: "header.tsx",
          },
          {
            id: "7",
            isSelectable: true,
            name: "footer.tsx",
          },
        ],
      },
      {
        id: "8",
        isSelectable: true,
        name: "lib",
        children: [
          {
            id: "9",
            isSelectable: true,
            name: "utils.ts",
          },
        ],
      },
    ],
  },
];

const Collection: FC = () => {
  return (
    <Tree className="p-2 overflow-hidden rounded-md bg-background" initialSelectedId="7" initialExpandedItems={["root"]} elements={ELEMENTS}>
      <FolderTree collection={temp} />
    </Tree>
  );
};

export default Collection;
