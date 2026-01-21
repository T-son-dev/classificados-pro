"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  adCount?: number;
}

export default function CategoryCard({ category, adCount = 0 }: CategoryCardProps) {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-4xl mb-3 block">{category.icon}</span>
            <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
            <p className="text-sm text-slate-500">{adCount.toLocaleString()} anuncios</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </div>

        {/* Subcategories Preview */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {category.subcategories.slice(0, 3).map((sub) => (
                <span
                  key={sub.id}
                  className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded"
                >
                  {sub.name}
                </span>
              ))}
              {category.subcategories.length > 3 && (
                <span className="text-xs text-blue-600 px-2 py-1">
                  +{category.subcategories.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
