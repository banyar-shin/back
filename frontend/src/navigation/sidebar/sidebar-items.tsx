import { LucideIcon, CheckSquare, MessageSquare, Home } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Features",
    items: [
      {
        title: "Home",
        path: "/dashboard",
        icon: Home,
      },
      {
        title: "Tasks",
        path: "/dashboard/tasks",
        icon: CheckSquare,
      },
      {
        title: "Chatbot",
        path: "/dashboard/chatbot",
        icon: MessageSquare,
      },
    ],
  },
];
