"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  User,
  Heart,
  Bell,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore, useFavoritesStore, useNotificationStore } from "@/lib/store";
import { sampleCategories } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favoriteIds } = useFavoritesStore();
  const { unreadCount } = useNotificationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/anuncios?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm">
        <span>Anuncie gratis! Crie sua conta e publique seu primeiro anuncio</span>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">
              Classificados<span className="text-blue-600">Pro</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que voce esta procurando?"
                className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Favorites */}
                <Link
                  href="/favoritos"
                  className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  {favoriteIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {favoriteIds.length}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link
                  href="/notificacoes"
                  className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2"
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-medium text-slate-900">{user?.name}</p>
                          <p className="text-sm text-slate-500">{user?.email}</p>
                        </div>
                        <Link
                          href="/painel"
                          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          Painel
                        </Link>
                        <Link
                          href="/meus-anuncios"
                          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-5 h-5" />
                          Meus Anuncios
                        </Link>
                        <Link
                          href="/configuracoes"
                          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5" />
                          Configuracoes
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}

            {/* Create Ad Button */}
            <Link
              href="/anunciar"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Anunciar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden md:flex items-center gap-6 py-3 border-t border-slate-100">
          <div className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium"
            >
              <Menu className="w-5 h-5" />
              Categorias
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
                >
                  {sampleCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categorias/${category.slug}`}
                      className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="text-xl">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Category Links */}
          {sampleCategories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="p-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar anuncios..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/painel"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 text-slate-400" />
                      Painel
                    </Link>
                    <Link
                      href="/meus-anuncios"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-5 h-5 text-slate-400" />
                      Meus Anuncios
                    </Link>
                    <Link
                      href="/favoritos"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5 text-slate-400" />
                      Favoritos ({favoriteIds.length})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 text-slate-400" />
                      Entrar
                    </Link>
                    <Link
                      href="/cadastro"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-5 h-5 text-slate-400" />
                      Cadastrar
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Categories */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-2">Categorias</p>
                <div className="grid grid-cols-2 gap-2">
                  {sampleCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categorias/${category.slug}`}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <Link
                href="/anunciar"
                className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="w-5 h-5" />
                Anunciar Gratis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
