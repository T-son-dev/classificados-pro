"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import AdCard from "@/components/AdCard";
import SearchFilters from "@/components/SearchFilters";
import { sampleAds } from "@/lib/sample-data";
import { searchAds } from "@/lib/ad-algorithm";
import { useSearchStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { AdSearchParams } from "@/lib/types";

type SortOption = "relevance" | "recent" | "price_asc" | "price_desc";
type ViewMode = "grid" | "list";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "recent", label: "Mais Recentes" },
  { value: "price_asc", label: "Menor Preco" },
  { value: "price_desc", label: "Maior Preco" },
];

function AdsPageLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
}

export default function AdsPage() {
  return (
    <Suspense fallback={<AdsPageLoading />}>
      <AdsPageContent />
    </Suspense>
  );
}

function AdsPageContent() {
  const searchParams = useSearchParams();
  const { params: filters, setParams: setFilters, resetParams } = useSearchStore();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 12;

  // Get search query from URL
  const searchQuery = searchParams.get("q") || "";
  const isPremiumFilter = searchParams.get("premium") === "true";
  const isFeaturedFilter = searchParams.get("destaque") === "true";

  // Apply search and filters
  const filteredAds = useMemo(() => {
    const searchOptions: AdSearchParams = {
      query: searchQuery || filters.query,
      categoryId: filters.categoryId,
      priceRange: {
        min: filters.priceRange?.min,
        max: filters.priceRange?.max,
      },
      location: {
        state: filters.location?.state,
        city: filters.location?.city,
      },
      condition: filters.condition,
      sortBy: sortBy === "recent" ? "date_desc" : sortBy === "relevance" ? "relevance" : sortBy,
      page: currentPage,
      pageSize: adsPerPage,
    };

    const result = searchAds(sampleAds, searchOptions);
    let results = result.ads;

    // Apply premium/featured filters from URL
    if (isPremiumFilter) {
      results = results.filter((ad) =>
        ["premium", "featured", "enterprise"].includes(ad.planType)
      );
    }
    if (isFeaturedFilter) {
      results = results.filter((ad) =>
        ["featured", "enterprise"].includes(ad.planType)
      );
    }

    return results;
  }, [searchQuery, filters, sortBy, isPremiumFilter, isFeaturedFilter, currentPage]);

  // Pagination
  const totalPages = Math.ceil(filteredAds.length / adsPerPage);
  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Active filters count
  const activeFiltersCount = [
    filters.categoryId,
    filters.priceRange?.min,
    filters.priceRange?.max,
    filters.location?.state,
    filters.location?.city,
    filters.condition,
  ].filter((v) => v !== undefined && v !== null).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Results Count */}
            <div className="flex-1">
              <p className="text-sm text-slate-600">
                <span className="font-semibold">{filteredAds.length}</span>{" "}
                {filteredAds.length === 1 ? "anuncio encontrado" : "anuncios encontrados"}
                {searchQuery && (
                  <span>
                    {" "}
                    para &quot;<span className="font-medium">{searchQuery}</span>&quot;
                  </span>
                )}
              </p>
            </div>

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

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {filters.categoryId && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                  Categoria
                  <button onClick={() => setFilters({ categoryId: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.priceRange?.min || filters.priceRange?.max) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                  Preco: R${filters.priceRange?.min || 0} - R${filters.priceRange?.max || "..."}
                  <button
                    onClick={() => setFilters({ priceRange: undefined })}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.location?.state && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                  {filters.location.state}
                  <button onClick={() => setFilters({ location: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.condition && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                  {Array.isArray(filters.condition) ? filters.condition.join(", ") : filters.condition}
                  <button onClick={() => setFilters({ condition: undefined })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
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

          {/* Ads Grid */}
          <div className="flex-1">
            {paginatedAds.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhum anuncio encontrado
                </h3>
                <p className="text-slate-500 mb-6">
                  Tente ajustar seus filtros ou fazer uma nova busca.
                </p>
                <button
                  onClick={() => resetParams()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    )}
                  >
                    {paginatedAds.map((ad) => (
                      <AdCard
                        key={ad.id}
                        ad={ad}
                        variant={viewMode === "list" ? "horizontal" : "default"}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Anterior
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page: number;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "w-10 h-10 rounded-xl text-sm font-medium transition-colors",
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Proximo
                    </button>
                  </div>
                )}
              </>
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
