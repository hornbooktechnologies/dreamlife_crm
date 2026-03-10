import {
  Home,
  Users,
  UserCheck,
  Calendar,
  CalendarDays,
  // Settings,
  FileText,
  Receipt,
  Activity,
  FolderKanban,
  ClockAlert,
} from "lucide-react";

export const MenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    // Visible to all roles
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    // Only visible to admin, hr, and manager (NOT employee)
    allowedRoles: ["admin", "hr", "manager"],
  },
  {
    title: "Employee",
    url: "/employee",
    icon: UserCheck,
    // Only visible to admin, hr, and manager (NOT employee)
    allowedRoles: ["admin", "hr", "manager"],
  },
  {
    title: "Leave",
    url: "/leave",
    icon: CalendarDays,
    // Visible to all roles
  },
  {
    title: "Holiday",
    url: "/holiday",
    icon: Calendar,
    // Visible to all roles
  },
  {
    title: "Attendance",
    url: "/attendance-tracking",
    icon: ClockAlert,
    allowedRoles: ["admin", "employee", "manager", "Bde", "bde", "BDE"],
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  //   // Visible to all roles
  // },
  {
    title: "Service Tax",
    url: "/service-tax",
    icon: Receipt,
    allowedRoles: ["admin", "manager", "employee", "Bde", "bde", "BDE"],
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
    allowedRoles: ["admin", "manager"],
  },
  {
    title: "Activity Logs",
    url: "/activity-logs",
    icon: Activity,
    allowedRoles: ["admin", "manager"],
  },
  // {
  //   title: "Resume",
  //   url: "/resume-builder",
  //   icon: FileText,
  //   allowedRoles: ["admin", "hr", "manager", "Bde", "bde", "BDE"],
  // },
  {
    title: "Projects",
    url: "/project-management",
    icon: FolderKanban,
    allowedRoles: ["admin"],
  },
];
