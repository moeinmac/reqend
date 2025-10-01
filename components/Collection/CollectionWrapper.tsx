import { type Collection } from "@/db/models.type";
import { File, Folder, FolderOpen, Globe } from "lucide-react";
import { FC, useState } from "react";
import TreeView, { TreeViewItem } from "../tree-view";
import NewFolder from "./NewFolder";
import { collectionToTree } from "@/lib/collectionToTree";
import { treeToCollection } from "@/lib/treeToCollection";

const customIconMap = {
  get: <Globe className="h-4 w-4 text-purple-500" />,
  patch: <Folder className="h-4 w-4 text-blue-500" />,
  post: <FolderOpen className="h-4 w-4 text-green-500" />,
  put: <File className="h-4 w-4 text-orange-500" />,
};

interface CollectionWrapperProps {
  data: Collection;
  onNewFolder: (newCollection: Collection) => void;
  onMove: (collection: Collection) => void;
}

const CollectionWrapper: FC<CollectionWrapperProps> = ({ data, onNewFolder, onMove }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [targetItem, setTargetItem] = useState<TreeViewItem | null>(null);

  const openFolderDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpen(true);
  };

  return (
    <>
      <TreeView
        openFolderDialog={openFolderDialog}
        data={collectionToTree(data)}
        iconMap={customIconMap}
        onMove={(_, __, ___, newTree) => onMove(treeToCollection(newTree, data.createdAt))}
        menuItems={[
          {
            id: "01",
            label: "New Folder",
            action: openFolderDialog,
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
