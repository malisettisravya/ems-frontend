"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  ClipboardList,
  CalendarCheck,
  CalendarClock,
  LogOut,
  UserCheck,
  ScanFace,
} from "lucide-react";

/* ---------------- Types ---------------- */
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

/* ---------------- Layout ---------------- */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { icon: <Home size={18} />, label: "Dashboard", href: "/employee/dashboard" },
    { icon: <User size={18} />, label: "My Profile", href: "/employee/profile" },
    { icon: <CalendarCheck size={18} />, label: "Leave Requests", href: "/employee/leaves" },
    { icon: <CalendarClock size={18} />, label: "Leave History", href: "/employee/history" },
    { icon: <UserCheck size={18} />, label: "Mark Attendance", href: "/employee/attendance" },
    { icon: <ScanFace size={18} />, label: "Register Face", href: "/employee/register-face" },
  ];

  const handleLogout = () => {
    // clear auth (adjust key as per your project)
    localStorage.removeItem("token");

    // redirect to login
    router.push("/login");
  };

  const getHeaderTitle = () => {
    if (pathname === "/employee/dashboard") return "Welcome back 👋";

    const currentItem = navigationItems.find(
      (item) => item.href === pathname
    );
    return currentItem ? currentItem.label : "Employee Panel";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white fixed inset-y-0 flex flex-col p-5 z-10">
        <h1 className="text-xl font-bold mb-8">EMS Employee</h1>

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

        {/* Logout */}
        <NavItem
          icon={<LogOut size={18} />}
          label="Logout"
          onClick={handleLogout}
        />
      </aside>

      {/* Main Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-6 bg-white border-b sticky top-0 z-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {getHeaderTitle()}
          </h2>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Item ---------------- */
function NavItem({ icon, label, href, onClick, active }: NavItemProps) {
  // If it's an action (logout)
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-2 rounded transition w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white"
      >
        {icon}
        <span className="text-sm">{label}</span>
      </button>
    );
  }

  // Normal navigation item
  return (
    <Link
      href={href!}
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