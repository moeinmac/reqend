import { Globe, Folder, FolderOpen, File, Download } from "lucide-react";
import TreeView, { TreeViewItem } from "../tree-view";

const data = [
  {
    id: "1",
    name: "Root",
    type: "region",
    children: [
      {
        id: "1.1",
        name: "Folder 1",
        type: "store",
        children: [
          {
            id: "1.1.1",
            name: "Subfolder",
            type: "department",
            children: [
              { id: "1.1.1.1", name: "File 1", type: "item" },
              { id: "1.1.1.2", name: "File 2", type: "item" },
            ],
          },
        ],
      },
    ],
  },
];

const customIconMap = {
  region: <Globe className="h-4 w-4 text-purple-500" />,
  store: <Folder className="h-4 w-4 text-blue-500" />,
  department: <FolderOpen className="h-4 w-4 text-green-500" />,
  item: <File className="h-4 w-4 text-orange-500" />,
};

const menuItems = [
  {
    id: "download",
    label: "Download",
    icon: <Download className="h-4 w-4" />,
    action: (items: any) => console.log("Downloading:", items),
  },
];

export default function Demo() {
  const handleCheckChange = (item: TreeViewItem, checked: boolean) => {
    console.log(`Item ${item.name} checked:`, checked);
  };

  return (
    <TreeView
      data={data}
      iconMap={customIconMap}
      onMove={(sourceId, targetId, position, newTree) => {
        console.log({ sourceId, targetId, position, newTree });
      }}
    />
  );
}
