"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import AdCard from "@/components/AdCard";
import CategoryCard from "@/components/CategoryCard";
import PlanCard from "@/components/PlanCard";
import { sampleAds, sampleCategories, samplePlans } from "@/lib/sample-data";
import { getHomepageAds } from "@/lib/ad-algorithm";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/anuncios?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Get ads organized by section using the algorithm
  const { featured: featuredAds, premium: premiumAds, regular: regularAds } = getHomepageAds(sampleAds);

  // Count ads per category (mock)
  const categoryAdCounts: Record<string, number> = {
    "cat-1": 1250,
    "cat-2": 3420,
    "cat-3": 890,
    "cat-4": 2100,
    "cat-5": 560,
    "cat-6": 1800,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              Compre, Venda e Anuncie
              <span className="text-blue-200"> de Forma Simples</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-blue-100 mb-8"
            >
              A maior plataforma de classificados do Brasil. Milhares de anuncios
              te esperando.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O que voce esta procurando?"
                className="w-full pl-14 pr-36 py-4 rounded-2xl text-slate-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Buscar
              </button>
            </motion.form>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-8 mt-10 text-sm"
            >
              <div className="text-center">
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-blue-200">Anuncios Ativos</p>
              </div>
              <div className="w-px h-10 bg-blue-400" />
              <div className="text-center">
                <p className="text-2xl font-bold">100K+</p>
                <p className="text-blue-200">Usuarios</p>
              </div>
              <div className="w-px h-10 bg-blue-400" />
              <div className="text-center">
                <p className="text-2xl font-bold">98%</p>
                <p className="text-blue-200">Satisfacao</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Categorias</h2>
              <p className="text-slate-500">Explore por categoria</p>
            </div>
            <Link
              href="/categorias"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sampleCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                adCount={categoryAdCounts[category.id] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredAds.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Destaques</h2>
                  <p className="text-slate-500">Anuncios em destaque</p>
                </div>
              </div>
              <Link
                href="/anuncios?destaque=true"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver mais
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Ads Section */}
      {premiumAds.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Premium</h2>
                  <p className="text-slate-500">Anuncios premium</p>
                </div>
              </div>
              <Link
                href="/anuncios?premium=true"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver mais
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Ads Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Anuncios Recentes</h2>
              <p className="text-slate-500">Os ultimos anuncios publicados</p>
            </div>
            <Link
              href="/anuncios"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularAds.slice(0, 8).map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/anuncios"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Ver Mais Anuncios
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Planos para Anunciantes
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Escolha o plano ideal para suas necessidades e aumente a visibilidade
              dos seus anuncios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {samplePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Por que usar ClassificadosPro?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              A plataforma mais completa para comprar e vender no Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Rapido e Facil
              </h3>
              <p className="text-slate-500 text-sm">
                Publique seu anuncio em menos de 2 minutos e alcance milhares de
                compradores.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                100% Seguro
              </h3>
              <p className="text-slate-500 text-sm">
                Verificamos todos os anuncios e oferecemos dicas de seguranca
                para suas negociacoes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Alta Visibilidade
              </h3>
              <p className="text-slate-500 text-sm">
                Planos premium para destacar seus anuncios e vender mais rapido.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Grande Comunidade
              </h3>
              <p className="text-slate-500 text-sm">
                Mais de 100 mil usuarios ativos buscando produtos e servicos
                todos os dias.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para comecar a vender?
          </h2>
          <p className="text-blue-100 mb-8">
            Crie sua conta gratuita e publique seu primeiro anuncio hoje mesmo.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/anunciar"
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Anunciar Gratis
            </Link>
            <Link
              href="/planos"
              className="px-8 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
