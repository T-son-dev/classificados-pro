"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Grid, List, ChevronDown } from "lucide-react";
import AdCard from "@/components/AdCard";
import SearchFilters from "@/components/SearchFilters";
import { sampleAds, sampleCategories } from "@/lib/sample-data";
import { getCategoryAds } from "@/lib/ad-algorithm";
import { cn } from "@/lib/utils";

type SortOption = "relevance" | "recent" | "price_asc" | "price_desc";
type ViewMode = "grid" | "list";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "recent", label: "Mais Recentes" },
  { value: "price_asc", label: "Menor Preco" },
  { value: "price_desc", label: "Maior Preco" },
];

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Find category
  const category = sampleCategories.find((c) => c.slug === slug);

  // Get category ads using algorithm
  const { highlightedAds, regularAds } = useMemo(() => {
    if (!category) {
      return { highlightedAds: [], regularAds: [] };
    }
    const result = getCategoryAds(sampleAds, category.id);
    return {
      highlightedAds: result.highlighted,
      regularAds: result.standard.ads
    };
  }, [category]);

  // Sort ads
  const sortedRegularAds = useMemo(() => {
    const sorted = [...regularAds];
    switch (sortBy) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    return sorted;
  }, [regularAds, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Categoria nao encontrada
          </h1>
          <p className="text-slate-500 mb-6">
            A categoria que voce esta procurando nao existe.
          </p>
          <Link
            href="/categorias"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Categorias
          </Link>
        </div>
      </div>
    );
  }

  const totalAds = highlightedAds.length + regularAds.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/categorias"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Todas as Categorias
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {category.name}
              </h1>
              <p className="text-slate-500">
                {totalAds.toLocaleString()}{" "}
                {totalAds === 1 ? "anuncio" : "anuncios"}
              </p>
            </div>
          </div>

          {/* Subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categorias/${category.slug}/${sub.slug}`}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium"
            >
              Filtros
            </button>

            <div className="flex-1" />

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none px-4 py-2 pr-10 bg-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-[140px]">
              <SearchFilters />
            </div>
          </aside>

          {/* Ads Content */}
          <div className="flex-1">
            {/* Highlighted Ads Section */}
            {highlightedAds.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                    Destaques
                  </span>
                </div>
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  )}
                >
                  {highlightedAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      variant={viewMode === "list" ? "horizontal" : "default"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Ads */}
            {sortedRegularAds.length > 0 && (
              <div>
                {highlightedAds.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-slate-500">
                      Todos os Anuncios
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  )}
                >
                  {sortedRegularAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      variant={viewMode === "list" ? "horizontal" : "default"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalAds === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhum anuncio nesta categoria
                </h3>
                <p className="text-slate-500 mb-6">
                  Seja o primeiro a anunciar em {category.name}!
                </p>
                <Link
                  href="/anunciar"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Criar Anuncio
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <SearchFilters
          showMobile
          onCloseMobile={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
