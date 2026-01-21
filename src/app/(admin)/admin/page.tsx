"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  BarChart3,
} from "lucide-react";
import { sampleAds } from "@/lib/sample-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  // Mock stats
  const stats = {
    totalAds: 15420,
    adsChange: 12.5,
    totalUsers: 8750,
    usersChange: 8.3,
    revenue: 45680,
    revenueChange: -2.4,
    activeSubscriptions: 1234,
    subscriptionsChange: 15.2,
  };

  // Mock pending ads
  const pendingAds = sampleAds.slice(0, 5);

  // Mock recent reports
  const recentReports = [
    {
      id: "1",
      adTitle: "iPhone 13 Pro Max",
      reason: "Produto falso",
      reporter: "joao@email.com",
      time: "2 horas atras",
    },
    {
      id: "2",
      adTitle: "Notebook Dell",
      reason: "Preco suspeito",
      reporter: "maria@email.com",
      time: "4 horas atras",
    },
    {
      id: "3",
      adTitle: "PS5 novo",
      reason: "Descricao enganosa",
      reporter: "pedro@email.com",
      time: "6 horas atras",
    },
  ];

  // Mock activity
  const recentActivity = [
    { type: "ad_approved", message: "Anuncio 'Sofa 3 lugares' aprovado", time: "1 min atras" },
    { type: "user_registered", message: "Novo usuario: Carlos Silva", time: "5 min atras" },
    { type: "plan_upgraded", message: "Usuario atualizou para Premium", time: "12 min atras" },
    { type: "ad_rejected", message: "Anuncio 'iPhone' rejeitado", time: "20 min atras" },
    { type: "report_resolved", message: "Denuncia #234 resolvida", time: "30 min atras" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-slate-400">
          Visao geral da plataforma ClassificadosPro
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                stats.adsChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {stats.adsChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.adsChange)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalAds.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400">Total de Anuncios</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-sm text-green-400 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              {stats.usersChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400">Usuarios Registrados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                stats.revenueChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {stats.revenueChange >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(stats.revenueChange)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(stats.revenue)}
          </p>
          <p className="text-sm text-slate-400">Receita Mensal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-sm text-green-400 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" />
              {stats.subscriptionsChange}%
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.activeSubscriptions.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400">Assinaturas Ativas</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Ads */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Anuncios Pendentes
            </h2>
            <Link
              href="/admin/anuncios?status=pending"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {pendingAds.map((ad) => (
              <div
                key={ad.id}
                className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-xl"
              >
                <img
                  src={ad.images[0]?.url || "/placeholder-ad.jpg"}
                  alt={ad.title}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{ad.title}</p>
                  <p className="text-sm text-slate-400">
                    {formatCurrency(ad.price)} - {formatRelativeTime(ad.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "ad_approved"
                      ? "bg-green-400"
                      : activity.type === "ad_rejected"
                      ? "bg-red-400"
                      : activity.type === "user_registered"
                      ? "bg-blue-400"
                      : activity.type === "plan_upgraded"
                      ? "bg-purple-400"
                      : "bg-amber-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{activity.message}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Denuncias Recentes
          </h2>
          <Link
            href="/admin/denuncias"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-400 border-b border-slate-700">
                <th className="pb-3 font-medium">Anuncio</th>
                <th className="pb-3 font-medium">Motivo</th>
                <th className="pb-3 font-medium">Denunciante</th>
                <th className="pb-3 font-medium">Data</th>
                <th className="pb-3 font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="py-3 text-white">{report.adTitle}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      {report.reason}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{report.reporter}</td>
                  <td className="py-3 text-slate-400">{report.time}</td>
                  <td className="py-3">
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30">
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
