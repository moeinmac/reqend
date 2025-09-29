import { FC } from "react";
import { Globe, Folder, FolderOpen, File, Download } from "lucide-react";
import TreeView from "../tree-view";
import { Collection as CollectionType } from "@/db/models.type";
import { collectionToTree } from "@/lib/collectionToTree";

const testCollection: CollectionType = {
  id: "col-1",
  name: "API Collection",
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  items: [
    {
      id: "folder-1",
      name: "Users",
      type: "folder",
      items: [
        {
          id: "req-1",
          name: "Get user",
          type: "request",
          method: "get",
        },
        {
          id: "req-2",
          name: "Create user",
          type: "request",
          method: "post",
        },
        {
          id: "subfolder-1",
          name: "Profile",
          type: "folder",
          items: [
            {
              id: "req-3",
              name: "Update profile",
              type: "request",
              method: "patch",
            },
          ],
        },
      ],
    },
    {
      id: "folder-2",
      name: "Admin",
      type: "folder",
      items: [
        {
          id: "req-4",
          name: "Replace settings",
          type: "request",
          method: "put",
        },
        {
          id: "req-5",
          name: "Delete account",
          type: "request",
          method: "delete",
        },
      ],
    },
    {
      id: "req-root-1",
      name: "Healthcheck",
      type: "request",
      method: "get",
    },
  ],
};

const customIconMap = {
  get: <Globe className="h-4 w-4 text-purple-500" />,
  patch: <Folder className="h-4 w-4 text-blue-500" />,
  post: <FolderOpen className="h-4 w-4 text-green-500" />,
  put: <File className="h-4 w-4 text-orange-500" />,
};

const Collection: FC = () => {
  return (
    <TreeView
      data={collectionToTree(testCollection)}
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
          },
        },
        {
          id: "02",
          label: "New Request",
          action: (item) => {},
        },
      ]}
    />
  );
};

export default Collection;
