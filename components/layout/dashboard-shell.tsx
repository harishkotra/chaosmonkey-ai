"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, FlaskConical, Home, Info, Radar, TestTube2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: FlaskConical },
  { href: "/testing", label: "Testing", icon: TestTube2 },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/about", label: "About", icon: Info }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[250px_1fr]">
        <aside className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Radar className="h-4 w-4 text-primary" /> Chaos Control</div>
          <nav className="mt-4 space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10",
                  pathname === item.href && "bg-white/10 text-white"
                )}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
            <Activity className="mb-2 h-4 w-4" /> Live monitor active
          </div>
        </aside>
        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
