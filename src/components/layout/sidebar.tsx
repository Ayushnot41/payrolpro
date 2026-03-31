"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calculator,
  FileText,
  PieChart,
  Settings,
  Receipt,
  LogOut,
  Building,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore, useUIStore } from "@/store";

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "WORKFORCE",
    items: [
      { title: "Workforce", href: "/employees", icon: Users },
      { title: "Attendance", href: "/attendance", icon: CalendarCheck },
    ],
  },
  {
    label: "PAYROLL",
    items: [
      { title: "Payroll Runs", href: "/payroll", icon: Calculator },
      { title: "Salary Slips", href: "/slips", icon: Receipt },
      { title: "Tax & Deductions", href: "/taxes", icon: FileText },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { title: "Insights", href: "/insights", icon: PieChart },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 md:static md:translate-x-0",
          !sidebarOpen && "-translate-x-full"
        )}
      >
      <div className="flex h-16 items-center px-6 py-4">
        <Building className="mr-2 h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">PayrollPro</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-4">
          {navGroups.map((group, index) => (
            <div key={index} className="space-y-1">
              {group.label && (
                <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </h4>
              )}
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "sidebarActive" : "sidebar"}
                      className={cn("w-full justify-start gap-3", isActive && "shadow-sm")}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white shadow-sm">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">Ayush Sarkar</span>
            <span className="truncate text-xs text-slate-400">Administrator • Enterprise</span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-2 w-full justify-start gap-3 text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      </div>
    </>
  );
}
