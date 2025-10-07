import { type Collection } from "@/db/models.type";
import { collectionToTree } from "@/lib/tree/collectionToTree";
import { treeToCollection } from "@/lib/tree/treeToCollection";
import { useCollectionStore } from "@/store/useCollectionStore";
import { useRequestStore } from "@/store/useRequestStore";
import { Folder } from "lucide-react";
import { FC, useActionState, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { TreeViewMenuItem } from "../TreeView/TreeItem";
import { TreeView, TreeViewItem } from "../TreeView/TreeView";
import MutateCollection from "./MutateCollection";
import NewFolder from "./NewFolder";

import { TbHttpDelete, TbHttpGet, TbHttpPatch, TbHttpPost, TbHttpPut } from "react-icons/tb";
import { useActiveReqStore } from "@/store/useActiveReqStore";

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

  const [targetItem, setTargetItem] = useState<TreeViewItem | null>(null);

  const openFolderDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpenFolder(true);
  };

  const openCollectionDialog = (item: TreeViewItem) => {
    setTargetItem(item);
    setOpenCollection(true);
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
        menuItems={
          mode === "sidebar"
            ? sidebarMenuItems
            : [
                {
                  id: "02",
                  label: "New Folder",
                  action: openFolderDialog,
                  type: ["folder", "request", "collection"],
                  shortcut: "⌘R",
                },
              ]
        }
      />
      {targetItem && (
        <NewFolder
          newFolderInput={{
            collectionId: data.id,
            targetId: targetItem.id,
          }}
          open={openFolder}
          setOpen={setOpenFolder}
        />
      )}

      {targetItem && (
        <MutateCollection mode="edit" collectionId={targetItem.id} value={targetItem.name} open={openCollection} setOpen={setOpenCollection} />
      )}
    </>
  );
};

export default CollectionWrapper;
