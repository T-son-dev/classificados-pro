"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Clock, Eye } from "lucide-react";
import { Ad, PlanType } from "@/lib/types";
import { formatCurrency, formatRelativeTime, getConditionLabel, getPlanBadgeClass } from "@/lib/utils";
import { useFavoritesStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AdCardProps {
  ad: Ad;
  variant?: "default" | "horizontal" | "compact";
  showPlanBadge?: boolean;
}

const planLabels: Record<PlanType, string> = {
  free: "Gratis",
  basic: "Basico",
  premium: "Premium",
  featured: "Destaque",
  enterprise: "Empresarial",
};

export default function AdCard({ ad, variant = "default", showPlanBadge = true }: AdCardProps) {
  const { favoriteIds, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = favoriteIds.includes(ad.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(ad.id);
    } else {
      addFavorite(ad.id);
    }
  };

  const isPremiumPlan = ["premium", "featured", "enterprise"].includes(ad.planType);
  const isFeatured = ad.planType === "featured" || ad.planType === "enterprise";

  if (variant === "horizontal") {
    return (
      <Link href={`/anuncio/${ad.slug}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className={cn(
            "ad-card bg-white rounded-xl border overflow-hidden flex",
            isFeatured && "ad-card-featured",
            ad.planType === "premium" && "ad-card-premium",
            ad.planType === "enterprise" && "ad-card-enterprise"
          )}
        >
          {/* Image */}
          <div className="relative w-48 h-36 shrink-0">
            <img
              src={ad.images[0]?.url || "/placeholder-ad.jpg"}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
                )}
              />
            </button>
            {showPlanBadge && isPremiumPlan && (
              <span className={cn("absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full", getPlanBadgeClass(ad.planType))}>
                {planLabels[ad.planType]}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 line-clamp-1">{ad.title}</h3>
              <span className="text-lg font-bold text-blue-600 shrink-0">
                {formatCurrency(ad.price)}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{ad.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {ad.location.city}, {ad.location.state}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(ad.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {ad.views}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/anuncio/${ad.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg border p-3 flex gap-3"
        >
          <img
            src={ad.images[0]?.url || "/placeholder-ad.jpg"}
            alt={ad.title}
            className="w-20 h-20 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 text-sm line-clamp-1">{ad.title}</h4>
            <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency(ad.price)}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {ad.location.city}
            </p>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/anuncio/${ad.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "ad-card bg-white rounded-xl border overflow-hidden relative",
          isFeatured && "ad-card-featured",
          ad.planType === "premium" && "ad-card-premium",
          ad.planType === "enterprise" && "ad-card-enterprise"
        )}
      >
        {/* Featured Ribbon */}
        {isFeatured && (
          <div className="ribbon">
            <span>Destaque</span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/3]">
          <img
            src={ad.images[0]?.url || "/placeholder-ad.jpg"}
            alt={ad.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {showPlanBadge && isPremiumPlan && (
              <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getPlanBadgeClass(ad.planType))}>
                {planLabels[ad.planType]}
              </span>
            )}
            {ad.condition && (
              <span className="px-2 py-1 text-xs font-medium bg-white/90 text-slate-700 rounded-full">
                {getConditionLabel(ad.condition)}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors z-10"
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
              )}
            />
          </button>

          {/* Image Count */}
          {ad.images.length > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
              {ad.images.length} fotos
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-blue-600">
              {ad.price === 0 ? "Gratis" : formatCurrency(ad.price)}
            </span>
            {ad.negotiable && (
              <span className="text-xs text-green-600 font-medium">Negociavel</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">{ad.title}</h3>

          {/* Location & Time */}
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {ad.location.city}, {ad.location.state}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatRelativeTime(ad.createdAt)}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-600">
                  {ad.contact.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {ad.contact.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{ad.views}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
