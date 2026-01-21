"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Painel",
    href: "/painel",
    icon: LayoutDashboard,
  },
  {
    label: "Meus Anuncios",
    href: "/meus-anuncios",
    icon: Package,
  },
  {
    label: "Novo Anuncio",
    href: "/anunciar",
    icon: PlusCircle,
  },
  {
    label: "Meu Plano",
    href: "/planos",
    icon: CreditCard,
  },
  {
    label: "Estatisticas",
    href: "/estatisticas",
    icon: BarChart3,
  },
  {
    label: "Notificacoes",
    href: "/notificacoes",
    icon: Bell,
  },
  {
    label: "Configuracoes",
    href: "/configuracoes",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="text-lg font-bold text-slate-900">
            Classificados<span className="text-blue-600">Pro</span>
          </Link>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Classificados<span className="text-blue-600">Pro</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-blue-600">
                {user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {user?.name || "Usuario"}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {user?.email || "email@example.com"}
              </p>
            </div>
          </div>
          {user?.currentPlan && (
            <div className="mt-3 px-3 py-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600 font-medium">
                Plano {user.currentPlan.name}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Voltar ao Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
