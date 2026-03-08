"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Home", path: "/dashboard" },
    { name: "Report", path: "/dashboard/study-sessions" },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 font-bold">
        {collapsed ? "DB" : "Dashboard"}
      </div>

      <nav className="mt-6 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`block px-4 py-2 rounded ${
              pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {collapsed ? item.name[0] : item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}