import { LucideIcon, CheckSquare, MessageSquare, LayoutDashboard } from "lucide-react";

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
        title: "Welcome!",
        path: "/dashboard",
        icon: LayoutDashboard,
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
