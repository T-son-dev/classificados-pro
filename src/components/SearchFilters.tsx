"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { sampleCategories } from "@/lib/sample-data";
import { useSearchStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  onApply?: () => void;
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function SearchFilters({
  onApply,
  showMobile = false,
  onCloseMobile,
}: SearchFiltersProps) {
  const { params, setParams, resetParams } = useSearchStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "category",
    "price",
    "location",
  ]);

  // Local state for price inputs
  const [priceMin, setPriceMin] = useState<string>(params.priceRange?.min?.toString() || "");
  const [priceMax, setPriceMax] = useState<string>(params.priceRange?.max?.toString() || "");
  const [city, setCity] = useState<string>(params.location?.city || "");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const conditions = [
    { value: "new", label: "Novo" },
    { value: "like_new", label: "Seminovo" },
    { value: "good", label: "Bom estado" },
    { value: "fair", label: "Usado" },
    { value: "parts", label: "Para pecas" },
  ];

  const states = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ];

  const handlePriceChange = (min: string, max: string) => {
    setPriceMin(min);
    setPriceMax(max);
    setParams({
      priceRange: {
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined,
      },
    });
  };

  const handleClearFilters = () => {
    resetParams();
    setPriceMin("");
    setPriceMax("");
    setCity("");
    onApply?.();
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Category Section */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-slate-900">Categoria</span>
          {expandedSections.includes("category") ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("category") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setParams({ categoryId: undefined })}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    !params.categoryId
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-slate-50"
                  )}
                >
                  Todas as categorias
                </button>
                {sampleCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setParams({ categoryId: category.id })}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                      params.categoryId === category.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Section */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Preco
          </span>
          {expandedSections.includes("price") ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("price") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">
                      Minimo
                    </label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => handlePriceChange(e.target.value, priceMax)}
                      placeholder="R$ 0"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 mb-1 block">
                      Maximo
                    </label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => handlePriceChange(priceMin, e.target.value)}
                      placeholder="R$ 0"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {/* Quick Price Ranges */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Ate R$100", min: "0", max: "100" },
                    { label: "R$100-500", min: "100", max: "500" },
                    { label: "R$500-1000", min: "500", max: "1000" },
                    { label: "+R$1000", min: "1000", max: "" },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceChange(range.min, range.max)}
                      className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Section */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection("location")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localizacao
          </span>
          {expandedSections.includes("location") ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("location") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <select
                  value={params.location?.state || ""}
                  onChange={(e) =>
                    setParams({
                      location: {
                        ...params.location,
                        state: e.target.value || undefined,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os estados</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setParams({
                      location: {
                        ...params.location,
                        city: e.target.value || undefined,
                      },
                    });
                  }}
                  placeholder="Cidade"
                  className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Condition Section */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => toggleSection("condition")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-slate-900">Condicao</span>
          {expandedSections.includes("condition") ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.includes("condition") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                {conditions.map((condition) => (
                  <label
                    key={condition.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={params.condition?.includes(condition.value as "new" | "like_new" | "good" | "fair" | "parts") || false}
                      onChange={(e) => {
                        const currentConditions = params.condition || [];
                        const conditionValue = condition.value as "new" | "like_new" | "good" | "fair" | "parts";
                        if (e.target.checked) {
                          setParams({ condition: [...currentConditions, conditionValue] });
                        } else {
                          setParams({
                            condition: currentConditions.filter((c) => c !== conditionValue),
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear Filters */}
      <button
        onClick={handleClearFilters}
        className="flex items-center justify-center gap-2 w-full py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Limpar filtros
      </button>
    </div>
  );

  // Mobile Drawer
  if (showMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={onCloseMobile}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Filtros</span>
              </div>
              <button onClick={onCloseMobile}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
              <button
                onClick={() => {
                  onApply?.();
                  onCloseMobile?.();
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop Sidebar
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
        <Filter className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-slate-900">Filtros</span>
      </div>
      <FilterContent />
    </div>
  );
}
