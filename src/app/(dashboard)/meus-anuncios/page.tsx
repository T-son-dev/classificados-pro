"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import { sampleAds } from "@/lib/sample-data";
import { Ad, AdStatus } from "@/lib/types";
import { formatCurrency, formatRelativeTime, getStatusLabel, getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TabStatus = "all" | AdStatus;

const statusTabs: { value: TabStatus; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "pending", label: "Pendentes" },
  { value: "rejected", label: "Rejeitados" },
  { value: "expired", label: "Expirados" },
];

const statusIcons: Partial<Record<AdStatus, React.ElementType>> = {
  active: CheckCircle,
  pending: Clock,
  rejected: XCircle,
  expired: AlertCircle,
  paused: Clock,
  draft: Clock,
  sold: CheckCircle,
};

export default function MyAdsPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Mock user ads
  const userAds = sampleAds;

  // Filter ads
  const filteredAds = userAds.filter((ad) => {
    const matchesStatus = activeTab === "all" || ad.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const statusCounts: Partial<Record<TabStatus, number>> = {
    all: userAds.length,
    active: userAds.filter((ad) => ad.status === "active").length,
    pending: userAds.filter((ad) => ad.status === "pending").length,
    rejected: userAds.filter((ad) => ad.status === "rejected").length,
    expired: userAds.filter((ad) => ad.status === "expired").length,
    paused: userAds.filter((ad) => ad.status === "paused").length,
    draft: userAds.filter((ad) => ad.status === "draft").length,
    sold: userAds.filter((ad) => ad.status === "sold").length,
  };

  const toggleSelectAd = (adId: string) => {
    setSelectedAds((prev) =>
      prev.includes(adId)
        ? prev.filter((id) => id !== adId)
        : [...prev, adId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAds.length === filteredAds.length) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map((ad) => ad.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Anuncios</h1>
          <p className="text-slate-500">Gerencie todos os seus anuncios</p>
        </div>
        <Link
          href="/anunciar"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Anuncio
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 mb-6">
        <div className="flex items-center gap-1 p-1 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.value
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  activeTab === tab.value
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {statusCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar anuncios..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {selectedAds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">
                {selectedAds.length} selecionado(s)
              </span>
              <button className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ads List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-sm font-medium text-slate-500 border-b border-slate-200">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={
                selectedAds.length === filteredAds.length &&
                filteredAds.length > 0
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="col-span-4">Anuncio</div>
          <div className="col-span-2">Preco</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Visualizacoes</div>
          <div className="col-span-1">Acoes</div>
        </div>

        {/* Ads */}
        {filteredAds.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhum anuncio encontrado
            </h3>
            <p className="text-slate-500 mb-6">
              {activeTab !== "all"
                ? `Voce nao tem anuncios com status "${getStatusLabel(activeTab as AdStatus)}".`
                : "Comece criando seu primeiro anuncio."}
            </p>
            <Link
              href="/anunciar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Anuncio
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAds.map((ad) => {
              const StatusIcon = statusIcons[ad.status] || Clock;
              const statusColor = getStatusColor(ad.status);
              const isSelected = selectedAds.includes(ad.id);

              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-6 md:py-4 hover:bg-slate-50 transition-colors",
                    isSelected && "bg-blue-50"
                  )}
                >
                  {/* Checkbox */}
                  <div className="hidden md:flex col-span-1 items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectAd(ad.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Ad Info */}
                  <div className="md:col-span-4 flex gap-3">
                    <img
                      src={ad.images[0]?.url || "/placeholder-ad.jpg"}
                      alt={ad.title}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/anuncio/${ad.slug}`}
                        className="font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                      >
                        {ad.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatRelativeTime(ad.createdAt)}
                      </p>
                      {ad.planType !== "free" && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-1">
                          <Star className="w-3 h-3" />
                          Plano {ad.planType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price (Mobile: inline, Desktop: separate column) */}
                  <div className="md:col-span-2 flex md:items-center">
                    <span className="md:hidden text-sm text-slate-500 mr-2">
                      Preco:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(ad.price)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2 flex items-center">
                    <span className="md:hidden text-sm text-slate-500 mr-2">
                      Status:
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                        statusColor
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {getStatusLabel(ad.status)}
                    </span>
                  </div>

                  {/* Views */}
                  <div className="md:col-span-2 flex items-center">
                    <span className="md:hidden text-sm text-slate-500 mr-2">
                      Views:
                    </span>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{ad.views}</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center justify-end gap-2 relative">
                    <Link
                      href={`/editar-anuncio/${ad.id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() =>
                        setShowActionMenu(showActionMenu === ad.id ? null : ad.id)
                      }
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Menu */}
                    <AnimatePresence>
                      {showActionMenu === ad.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10"
                        >
                          <Link
                            href={`/anuncio/${ad.slug}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <Eye className="w-4 h-4" />
                            Ver Anuncio
                          </Link>
                          <Link
                            href={`/editar-anuncio/${ad.id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </Link>
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <TrendingUp className="w-4 h-4" />
                            Promover
                          </button>
                          <hr className="my-1 border-slate-200" />
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => setShowActionMenu(null)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
