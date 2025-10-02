import { type Collection } from "@/db/models.type";
import { collectionToTree } from "@/lib/tree/collectionToTree";
import { treeToCollection } from "@/lib/tree/treeToCollection";
import { File, Folder, FolderOpen, Globe } from "lucide-react";
import { FC, useState } from "react";
import { TreeView, TreeViewItem } from "../TreeView/TreeView";
import NewFolder from "./NewFolder";
import MutateCollection from "./MutateCollection";

const customIconMap = {
  get: <Globe className="h-4 w-4 text-purple-500" />,
  patch: <Folder className="h-4 w-4 text-blue-500" />,
  post: <FolderOpen className="h-4 w-4 text-green-500" />,
  put: <File className="h-4 w-4 text-orange-500" />,
  folder: <Folder className="h-4 w-4 text-primary/80" />,
};

interface CollectionWrapperProps {
  data: Collection;
  onNewFolder: (newCollection: Collection) => void;
  onMove: (collection: Collection) => void;
  onRemoveCollection: (collectionId: string) => void;
  onRenameCollection: (collection: Collection) => void;
}

const CollectionWrapper: FC<CollectionWrapperProps> = ({ data, onNewFolder, onMove, onRemoveCollection, onRenameCollection }) => {
  const [openFolder, setOpenFolder] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);

  const [targetItem, setTargetItem] = useState<TreeViewItem | null>(null);

  const openFolderDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpenFolder(true);
  };

  const openCollectionDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpenCollection(true);
  };

  return (
    <>
      <TreeView
        data={collectionToTree(data)}
        iconMap={customIconMap}
        onMove={(_, __, ___, newTree) => onMove(treeToCollection(newTree, data.createdAt))}
        menuItems={[
          {
            id: "00",
            label: "Rename Collection",
            action: openCollectionDialog,
            type: ["collection"],
            shortcut: "⌘Q",
          },
          {
            id: "01",
            label: "Remove Collection",
            action: (item) => onRemoveCollection(item.id),
            type: ["collection"],
            shortcut: "⌘C",
          },
          {
            id: "02",
            label: "New Folder",
            action: openFolderDialog,
            type: ["folder", "request", "collection"],
            shortcut: "⌘R",
          },
          {
            id: "03",
            label: "New Request",
            action: (item) => {},
            type: ["folder", "request"],
            shortcut: "⌘N",
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
          open={openFolder}
          setOpen={setOpenFolder}
        />
      )}

      {targetItem && (
        <MutateCollection
          mode="edit"
          collectionId={targetItem.id}
          value={targetItem.name}
          open={openCollection}
          setOpen={setOpenCollection}
          onEditCollection={onRenameCollection}
        />
      )}
    </>
  );
};

export default CollectionWrapper;
