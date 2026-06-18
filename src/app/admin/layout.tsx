"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User, FolderOpen, BarChart2, Briefcase, Mail, LogOut, ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin/profile",    icon: User,        label: "Profile"    },
  { href: "/admin/projects",   icon: FolderOpen,  label: "Projects"   },
  { href: "/admin/skills",     icon: BarChart2,   label: "Skills"     },
  { href: "/admin/background", icon: Briefcase,   label: "Background" },
  { href: "/admin/contact",    icon: Mail,        label: "Contact"    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex" style={{ background: "#080d1a", fontFamily: "DM Sans, sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col py-6 px-3"
        style={{
          background: "#060a15",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="px-3 mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "#00d9ff" }}
          >
            Portfolio
          </p>
          <p className="text-sm font-bold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(0,217,255,0.1)" : "transparent",
                  border: active ? "1px solid rgba(0,217,255,0.2)" : "1px solid transparent",
                  color: active ? "#00d9ff" : "#94a3b8",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="space-y-1 mt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: "#64748b" }}
          >
            <ExternalLink size={16} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: "#64748b" }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
