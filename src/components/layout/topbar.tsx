"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getMonthName } from "@/lib/utils";
import { useUIStore } from "@/store";
import { Building } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const { selectedMonth, selectedYear, setSidebarOpen } = useUIStore();

  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return [{ label: "Dashboard", href: "/" }];

    return [
      { label: "Home", href: "/" },
      ...paths.map((p, i) => ({
        label: p.charAt(0).toUpperCase() + p.slice(1).replace("-", " "),
        href: "/" + paths.slice(0, i + 1).join("/"),
      })),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <nav className="hidden md:flex text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="inline-flex items-center">
                {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-foreground">{crumb.label}</span>
                ) : (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees, reports..."
            className="w-full bg-slate-100 pl-9 border-none h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary shadow-none"
          />
        </div>

        <div className="hidden sm:flex items-center gap-3 border-l pl-4 ml-4">
          <button className="relative rounded-full p-2 hover:bg-slate-100 text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive"></span>
          </button>
          
          <button className="rounded-full p-2 hover:bg-slate-100 text-slate-600 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 shadow-sm ml-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
              AS
            </div>
            <span className="text-xs font-semibold">Acme Corp</span>
          </div>
        </div>
      </div>
    </header>
  );
}
