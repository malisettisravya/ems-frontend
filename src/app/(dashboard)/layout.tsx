"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  ClipboardList,
  LogOut,
  ShieldCheck, // ✅ added
} from "lucide-react";

/* ---------------- Types ---------------- */
type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
};

/* ---------------- Layout ---------------- */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { icon: <Home size={25} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Users size={25} />, label: "Employees", href: "/employees" },
    { icon: <ClipboardList size={25} />, label: "Leave Requests", href: "/leaves" },
    { icon: <ClipboardList size={25} />, label: "Attendance Overview", href: "/tasks" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getHeaderTitle = () => {
    if (pathname === "/dashboard") return "Welcome back, Admin 👋";

    const currentItem = navigationItems.find(
      (item) => item.href === pathname
    );

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
          icon={<LogOut size={25} />}
          label="Logout"
          onClick={handleLogout}
        />
      </aside>

      {/* Main Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="flex justify-between items-center p-6 bg-white border-b sticky top-0 z-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {getHeaderTitle()}
          </h2>

          {/* ✅ ADMIN BADGE (RIGHT SIDE) */}
          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
            <ShieldCheck size={18} />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>

        <main className="p-6 flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar Item ---------------- */
function NavItem({ icon, label, href, active, onClick }: NavItemProps) {
  const baseClass = `flex items-center gap-3 px-3 py-2 rounded transition ${
    active
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClass}>
        {icon}
        <span className="text-l">{label}</span>
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={baseClass}>
      {icon}
      <span className="text-l">{label}</span>
    </Link>
  );
}