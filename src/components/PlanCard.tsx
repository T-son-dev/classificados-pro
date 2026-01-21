"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Rocket } from "lucide-react";
import { Plan } from "@/lib/types";
import { formatCurrency, getPlanColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: Plan;
  isSelected?: boolean;
  onSelect?: (plan: Plan) => void;
  showButton?: boolean;
}

const planIcons = {
  free: Star,
  basic: Zap,
  premium: Crown,
  featured: Rocket,
  enterprise: Crown,
};

export default function PlanCard({ plan, isSelected, onSelect, showButton = true }: PlanCardProps) {
  const Icon = planIcons[plan.type];
  const { bg, text, border } = getPlanColor(plan.type);
  // Premium plan is the most popular one
  const isHighlighted = plan.type === "premium";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect?.(plan)}
      className={cn(
        "plan-card relative bg-white rounded-2xl border-2 p-6 overflow-hidden",
        isSelected ? "ring-2 ring-offset-2" : "",
        onSelect && "cursor-pointer",
        isHighlighted && "border-amber-400"
      )}
      style={{
        borderColor: isSelected ? border : isHighlighted ? "#fbbf24" : "#e2e8f0",
        boxShadow: isSelected ? `0 0 20px ${border}33` : "none",
      }}
    >
      {/* Popular Badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full uppercase">
            Mais Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div
          className={cn("w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center")}
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-7 h-7" style={{ color: text }} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{plan.nameEn}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-slate-900">
            {plan.price === 0 ? "Gratis" : formatCurrency(plan.price)}
          </span>
          {plan.price > 0 && <span className="text-slate-500">/mes</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500 shrink-0" />
          <span className="text-sm text-slate-600">
            {plan.features.maxActiveAds === -1
              ? "Anuncios ilimitados"
              : `Ate ${plan.features.maxActiveAds} anuncios ativos`}
          </span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500 shrink-0" />
          <span className="text-sm text-slate-600">
            Duracao de {plan.features.adDurationDays} dias
          </span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500 shrink-0" />
          <span className="text-sm text-slate-600">
            Ate {plan.features.maxPhotosPerAd} fotos por anuncio
          </span>
        </li>
        {plan.features.highlightedAds && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Anuncios em destaque</span>
          </li>
        )}
        {plan.features.featuredInCategory && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Destaque na categoria</span>
          </li>
        )}
        {plan.features.priorityInSearch && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Prioridade nas buscas</span>
          </li>
        )}
        {plan.features.videoSupport && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Suporte a videos</span>
          </li>
        )}
        {plan.features.analytics && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Estatisticas detalhadas</span>
          </li>
        )}
        {plan.features.prioritySupport && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Suporte prioritario</span>
          </li>
        )}
        {plan.features.seoOptimization && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Otimizacao SEO</span>
          </li>
        )}
        {plan.features.socialMediaIntegration && (
          <li className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span className="text-sm text-slate-600">Integracao com redes sociais</span>
          </li>
        )}
      </ul>

      {/* Visibility Info */}
      <div className="text-center mb-6 p-3 bg-slate-50 rounded-xl">
        <p className="text-xs text-slate-500 mb-1">Visibilidade</p>
        <div className="flex items-center justify-center gap-2">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${plan.features.displayProbability * 100}%`,
              maxWidth: "100px",
              backgroundColor: text,
            }}
          />
          <span className="text-sm font-semibold" style={{ color: text }}>
            {Math.round(plan.features.displayProbability * 100)}%
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {showButton && (
        <button
          className={cn(
            "w-full py-3 rounded-xl font-medium transition-all",
            isHighlighted
              ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:opacity-90"
              : plan.type === "free"
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "text-white hover:opacity-90"
          )}
          style={{
            backgroundColor: !isHighlighted && plan.type !== "free" ? text : undefined,
          }}
        >
          {plan.type === "free" ? "Comecar Gratis" : `Assinar ${plan.name}`}
        </button>
      )}
    </motion.div>
  );
}
