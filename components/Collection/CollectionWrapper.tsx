import { type Collection } from "@/db/models.type";
import { File, Folder, FolderOpen, Globe } from "lucide-react";
import { FC, useState } from "react";
import TreeView, { TreeViewItem } from "../tree-view";
import NewFolder from "./NewFolder";
import { collectionToTree } from "@/lib/collectionToTree";

const customIconMap = {
  get: <Globe className="h-4 w-4 text-purple-500" />,
  patch: <Folder className="h-4 w-4 text-blue-500" />,
  post: <FolderOpen className="h-4 w-4 text-green-500" />,
  put: <File className="h-4 w-4 text-orange-500" />,
};

interface CollectionWrapperProps {
  data: Collection;
  onNewFolder: (newCollection: Collection) => void;
}

const CollectionWrapper: FC<CollectionWrapperProps> = ({ data, onNewFolder }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [targetItem, setTargetItem] = useState<TreeViewItem | null>(null);
  return (
    <>
      <TreeView
        data={collectionToTree(data)}
        iconMap={customIconMap}
        onMove={(sourceId, targetId, position, newTree) => {
          console.log({ sourceId, targetId, position, newTree });
        }}
        menuItems={[
          {
            id: "01",
            label: "New Folder",
            action: (item) => {
              console.log(item);
              setTargetItem(item);
              setOpen(true);
            },
          },
          {
            id: "02",
            label: "New Request",
            action: (item) => {},
          },
        ]}
      />
      {targetItem && (
        <NewFolder
          newFolderInput={{
            collectionId: data.id,
            targetId: targetItem.id,
          }}
          onNewFolder={onNewFolder}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  );
};

export default CollectionWrapper;
