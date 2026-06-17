"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

/* ---------------- Types ---------------- */
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

/* ---------------- Layout ---------------- */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigationItems = [
    { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Users size={18} />, label: "Employees", href: "/employees" },
    { icon: <ClipboardList size={18} />, label: "Leave Requests", href: "/leaves" },
    { icon: <ClipboardList size={18} />, label: "Attendance Overview", href: "/tasks" },
  ];

  // Helper function to dynamically determine the correct header title
  const getHeaderTitle = () => {
    if (pathname === "/dashboard") return "Welcome back, Admin 👋";
    
    // Find matching item in navigation list to get the clean label
    const currentItem = navigationItems.find((item) => item.href === pathname);
    return currentItem ? currentItem.label : "Admin Panel";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white fixed inset-y-0 flex flex-col p-5 z-10">
        <h1 className="text-xl font-bold mb-8">EMS Admin</h1>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <NavItem
          icon={<LogOut size={18} />}
          label="Logout"
          href="/logout"
        />
      </aside>

      {/* Main Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Dynamic Header */}
        <header className="flex justify-between items-center p-6 bg-white border-b sticky top-0 z-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {getHeaderTitle()}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Item ---------------- */
function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded transition ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}