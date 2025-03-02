import { File, Inbox, Send, Receipt, KeySquare, LucideIcon, PanelsTopLeft } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

const basePath = "/";

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Tasks",
        path: basePath,
        icon: PanelsTopLeft,
        isActive: true,
      },
      {
        title: "Calendar",
        path: basePath,
        icon: PanelsTopLeft,
        isActive: false,
      },
    ],
  },
  {
    id: 2,
    label: "Features",
    items: [
      {
        title: "Tasks",
        path: "#",
        icon: Receipt,
        subItems: [
          { title: "List View", path: `${basePath}/invoice/list-preview` },
          { title: "Calendar View", path: `${basePath}/invoice/view` },
          { title: "Add", path: `${basePath}/invoice/add` },
          { title: "Edit", path: `${basePath}/invoice/edit` },
        ],
      },
      {
        title: "Auth",
        path: "#",
        icon: KeySquare,
        subItems: [{ title: "Unauthorized", path: `${basePath}/auth/unauthorized` }],
      },
      {
        title: "Drafts",
        path: `${basePath}/drafts`,
        icon: File,
      },
      {
        title: "Sent",
        path: `${basePath}/sent`,
        icon: Send,
      },
    ],
  },
];
