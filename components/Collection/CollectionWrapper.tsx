import { type Collection } from "@/db/models.type";
import { collectionToTree } from "@/lib/tree/collectionToTree";
import { treeToCollection } from "@/lib/tree/treeToCollection";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useRequestStore } from "@/store/useRequestStore";
import { Folder } from "lucide-react";
import { FC, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TreeViewMenuItem } from "../TreeView/TreeItem";
import { TreeView, TreeViewItem } from "../TreeView/TreeView";
import MutateCollection from "./MutateCollection";
import MutateFolder, { MutateFolderProps } from "./MutateFolder";

import { useActiveReqStore } from "@/store/useActiveReqStore";
import { TbHttpDelete, TbHttpGet, TbHttpPatch, TbHttpPost, TbHttpPut } from "react-icons/tb";

const customIconMap = {
  get: <TbHttpGet className={`h-4 w-4 text-[#84a98c]`} />,
  patch: <TbHttpPatch className={`h-4 w-4 text-[#ade8f4]`} />,
  post: <TbHttpPost className={`h-4 w-4 text-[#ffbf69]`} />,
  put: <TbHttpPut className={`h-4 w-4 text-[#ffafcc]`} />,
  delete: <TbHttpDelete className={`h-4 w-4 text-[#bc4749]`} />,
  folder: <Folder className="h-4 w-4 text-primary/80" />,
};

interface CollectionWrapperProps {
  mode: "sidebar" | "treeview";
  data: Collection;
}

const CollectionWrapper: FC<CollectionWrapperProps> = ({ data, mode }) => {
  const requestPrimary = useRequestStore((state) => state.request);

  const [openFolder, setOpenFolder] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);

  const { onRemoveCollection, onMoveCollection, saveRequest } = useCollectionStore(
    useShallow((state) => ({
      onRemoveCollection: state.removeCollection,
      onMoveCollection: state.moveCollection,
      saveRequest: state.saveRequest,
    }))
  );

  const { onSaveActiveRequest, addTempRequest } = useActiveReqStore(
    useShallow((state) => ({
      onSaveActiveRequest: state.save,
      addTempRequest: state.addTemp,
    }))
  );

  const [targetItem, setTargetItem] = useState<(TreeViewItem & { folderMode?: MutateFolderProps["mode"] }) | null>(null);

  const openFolderDialog = (item: TreeViewItem, mode: MutateFolderProps["mode"]) => {
    setTargetItem({ ...item, folderMode: mode });
    setOpenFolder(true);
  };

  const openCollectionDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpenCollection(true);
  };

  const newFolderMenuItem: TreeViewMenuItem = {
    id: "02",
    label: "New Folder",
    action: (item) => openFolderDialog(item, "create"),
    type: ["folder", "request", "collection"],
    shortcut: "⌘R",
  };

  const sidebarMenuItems: TreeViewMenuItem[] = [
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
      separator: true,
    },
    newFolderMenuItem,
    {
      id: "03",
      label: "Rename Folder",
      action: (item) => openFolderDialog(item, "rename"),
      type: ["folder"],
      shortcut: "⌘R",
      separator: true,
    },

    {
      id: "04",
      label: "New Request",
      action: () => addTempRequest(),
      type: ["folder", "request"],
      shortcut: "⌘N",
    },
  ];

  const onSaveRequestHandler = async (item: TreeViewItem) => {
    await saveRequest({ collectionId: data.id, targetId: item.id, requestPrimary: requestPrimary! });
    await onSaveActiveRequest(requestPrimary!.id, data.id);
  };

  return (
    <>
      <TreeView
        onSaveRequest={mode === "treeview" ? onSaveRequestHandler : undefined}
        data={collectionToTree(data)}
        iconMap={customIconMap}
        onMove={async (newTree) => onMoveCollection(treeToCollection(newTree, data.createdAt))}
        menuItems={mode === "sidebar" ? sidebarMenuItems : [newFolderMenuItem]}
      />
      {targetItem && targetItem.folderMode && targetItem.folderMode === "rename" && (
        <MutateFolder
          mutateFolderInput={{
            collectionId: data.id,
            targetId: targetItem.id,
            folderName: targetItem.name,
          }}
          open={openFolder}
          setOpen={(open) => {
            if (!open) setTargetItem(null);
            setOpenFolder(open);
          }}
          mode={"rename"}
        />
      )}

      {targetItem && targetItem.folderMode && targetItem.folderMode === "create" && (
        <MutateFolder
          mutateFolderInput={{
            collectionId: data.id,
            targetId: targetItem.id,
          }}
          open={openFolder}
          setOpen={setOpenFolder}
          mode={"create"}
        />
      )}

      {targetItem && (
        <MutateCollection mode="edit" collectionId={targetItem.id} value={targetItem.name} open={openCollection} setOpen={setOpenCollection} />
      )}
    </>
  );
};

export default CollectionWrapper;
