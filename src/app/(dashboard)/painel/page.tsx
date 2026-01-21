"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Plus,
  BarChart3,
} from "lucide-react";
import AdCard from "@/components/AdCard";
import { sampleAds } from "@/lib/sample-data";
import { useAuthStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock user ads (filter by current user)
  const userAds = sampleAds.slice(0, 4);
  const activeAds = userAds.filter((ad) => ad.status === "active").length;
  const pendingAds = userAds.filter((ad) => ad.status === "pending").length;

  // Mock stats
  const stats = {
    totalViews: 1234,
    totalContacts: 45,
    totalFavorites: 89,
    viewsChange: 12.5,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: "1",
      type: "view",
      message: "Seu anuncio 'iPhone 13' recebeu 15 visualizacoes",
      time: "2 horas atras",
    },
    {
      id: "2",
      type: "contact",
      message: "Novo contato para 'Sofa 3 lugares'",
      time: "4 horas atras",
    },
    {
      id: "3",
      type: "favorite",
      message: "'MacBook Pro M1' foi favoritado 3 vezes",
      time: "6 horas atras",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Ola, {user?.name || "Usuario"}!
        </h1>
        <p className="text-slate-500">
          Bem-vindo ao seu painel de controle. Aqui voce pode gerenciar seus anuncios.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              {activeAds} ativos
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{userAds.length}</p>
          <p className="text-sm text-slate-500">Total de Anuncios</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +{stats.viewsChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalViews.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500">Visualizacoes Totais</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalContacts}</p>
          <p className="text-sm text-slate-500">Contatos Recebidos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalFavorites}</p>
          <p className="text-sm text-slate-500">Favoritos</p>
        </motion.div>
      </div>

      {/* Quick Actions & Plan Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Acoes Rapidas
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/anunciar"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-slate-900">Criar Anuncio</p>
                <p className="text-sm text-slate-500">Publique novo anuncio</p>
              </div>
            </Link>
            <Link
              href="/meus-anuncios"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Package className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-slate-900">Meus Anuncios</p>
                <p className="text-sm text-slate-500">Gerencie seus anuncios</p>
              </div>
            </Link>
            <Link
              href="/estatisticas"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-slate-900">Estatisticas</p>
                <p className="text-sm text-slate-500">Veja seu desempenho</p>
              </div>
            </Link>
            <Link
              href="/planos"
              className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <div>
                <p className="font-medium text-slate-900">Fazer Upgrade</p>
                <p className="text-sm text-slate-500">Aumente visibilidade</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">Seu Plano</h2>
          <div className="mb-4">
            <p className="text-3xl font-bold">{user?.currentPlan?.name || "Gratuito"}</p>
            <p className="text-white/80 text-sm">
              {user?.currentPlan?.price
                ? `${formatCurrency(user.currentPlan.price)}/mes`
                : "Sem custos"}
            </p>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Anuncios ativos</span>
              <span className="font-medium">
                {activeAds}/{user?.currentPlan?.features.maxActiveAds || 5}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2"
                style={{
                  width: `${(activeAds / (user?.currentPlan?.features.maxActiveAds || 5)) * 100}%`,
                }}
              />
            </div>
          </div>
          <Link
            href="/planos"
            className="block w-full py-2 bg-white text-purple-600 rounded-xl font-medium text-center hover:bg-white/90 transition-colors"
          >
            Fazer Upgrade
          </Link>
        </div>
      </div>

      {/* Recent Activity & Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === "view"
                      ? "bg-purple-100"
                      : activity.type === "contact"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {activity.type === "view" && (
                    <Eye className="w-4 h-4 text-purple-600" />
                  )}
                  {activity.type === "contact" && (
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  )}
                  {activity.type === "favorite" && (
                    <Heart className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.message}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Itens Pendentes
          </h2>
          {pendingAds > 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">
                    {pendingAds} anuncio(s) aguardando aprovacao
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Seus anuncios serao revisados em ate 24 horas.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700">
                Tudo certo! Nenhum item pendente no momento.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Ads */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Seus Anuncios Recentes
          </h2>
          <Link
            href="/meus-anuncios"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos
          </Link>
        </div>
        {userAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userAds.slice(0, 4).map((ad) => (
              <AdCard key={ad.id} ad={ad} showPlanBadge={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              Voce ainda nao tem nenhum anuncio publicado.
            </p>
            <Link
              href="/anunciar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Anuncio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
