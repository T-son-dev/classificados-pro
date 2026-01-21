"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Rocket, ArrowRight } from "lucide-react";
import PlanCard from "@/components/PlanCard";
import { samplePlans } from "@/lib/sample-data";
import { Plan } from "@/lib/types";
import { useAuthStore } from "@/lib/store";
import { formatCurrency, getPlanColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PlansPage() {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const currentPlan = user?.currentPlan || samplePlans[0];

  // Calculate yearly discount
  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      // Handle upgrade logic
      alert(`Upgrade para ${selectedPlan.name} solicitado!`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Escolha seu Plano
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Aumente a visibilidade dos seus anuncios e venda mais rapido com nossos
          planos premium.
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-white/80 mb-1">Seu Plano Atual</p>
            <p className="text-2xl font-bold">{currentPlan.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80 mb-1">Valor</p>
            <p className="text-2xl font-bold">
              {currentPlan.price === 0
                ? "Gratis"
                : `${formatCurrency(currentPlan.price)}/mes`}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm">
                {currentPlan.features.maxActiveAds === -1
                  ? "Anuncios ilimitados"
                  : `${currentPlan.features.maxActiveAds} anuncios ativos`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm">
                {currentPlan.features.adDurationDays} dias de duracao
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-sm">
                {Math.round(currentPlan.features.displayProbability * 100)}% de
                visibilidade
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "px-4 py-2 rounded-xl font-medium transition-colors",
            billingCycle === "monthly"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          )}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={cn(
            "px-4 py-2 rounded-xl font-medium transition-colors relative",
            billingCycle === "yearly"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-600"
          )}
        >
          Anual
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
            -20%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {samplePlans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSelectPlan(plan)}
            className={cn(
              "cursor-pointer rounded-2xl border-2 transition-all",
              selectedPlan?.id === plan.id
                ? "border-blue-600 shadow-lg shadow-blue-100"
                : "border-slate-200",
              currentPlan.id === plan.id && "ring-2 ring-green-500 ring-offset-2"
            )}
          >
            <PlanCard plan={plan} showButton={false} />
            {currentPlan.id === plan.id && (
              <div className="px-6 pb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  <Check className="w-3 h-3" />
                  Plano Atual
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Plan Details */}
      {selectedPlan && selectedPlan.id !== currentPlan.id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Upgrade para {selectedPlan.name}
              </h3>
              <p className="text-slate-500">
                Aumente sua visibilidade e alcance mais compradores.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(
                  billingCycle === "monthly"
                    ? selectedPlan.price
                    : getYearlyPrice(selectedPlan.price)
                )}
              </p>
              <p className="text-sm text-slate-500">
                /{billingCycle === "monthly" ? "mes" : "ano"}
              </p>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-500 mb-3">
                Seu plano atual ({currentPlan.name})
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-slate-600">
                  {currentPlan.features.maxActiveAds === -1
                    ? "Ilimitados"
                    : currentPlan.features.maxActiveAds}{" "}
                  anuncios
                </li>
                <li className="text-sm text-slate-600">
                  {currentPlan.features.adDurationDays} dias
                </li>
                <li className="text-sm text-slate-600">
                  {Math.round(currentPlan.features.displayProbability * 100)}%
                  visibilidade
                </li>
              </ul>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: getPlanColor(selectedPlan.type).bg }}
            >
              <p
                className="text-sm font-medium mb-3"
                style={{ color: getPlanColor(selectedPlan.type).text }}
              >
                Novo plano ({selectedPlan.name})
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-slate-700 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  {selectedPlan.features.maxActiveAds === -1
                    ? "Ilimitados"
                    : selectedPlan.features.maxActiveAds}{" "}
                  anuncios
                </li>
                <li className="text-sm text-slate-700 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  {selectedPlan.features.adDurationDays} dias
                </li>
                <li className="text-sm text-slate-700 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  {Math.round(selectedPlan.features.displayProbability * 100)}%
                  visibilidade
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Fazer Upgrade para {selectedPlan.name}
          </button>
        </motion.div>
      )}

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
          Perguntas Frequentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Posso cancelar a qualquer momento?
            </h3>
            <p className="text-sm text-slate-500">
              Sim! Voce pode cancelar sua assinatura a qualquer momento. O acesso
              continua ate o fim do periodo pago.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Como funciona a visibilidade?
            </h3>
            <p className="text-sm text-slate-500">
              Planos premium aumentam a probabilidade dos seus anuncios aparecerem
              no topo das buscas e em posicoes de destaque.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Posso fazer downgrade?
            </h3>
            <p className="text-sm text-slate-500">
              Sim, voce pode alterar seu plano para um inferior. As mudancas
              entram em vigor no proximo ciclo de cobranca.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Quais formas de pagamento sao aceitas?
            </h3>
            <p className="text-sm text-slate-500">
              Aceitamos cartoes de credito, debito, PIX e boleto bancario para
              planos anuais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
