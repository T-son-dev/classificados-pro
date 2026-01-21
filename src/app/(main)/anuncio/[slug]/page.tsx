"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Eye,
  Star,
  Phone,
  MessageCircle,
  Shield,
  Verified,
  ChevronLeft,
  ChevronRight,
  Flag,
  Package,
  Calendar,
  Tag,
} from "lucide-react";
import AdCard from "@/components/AdCard";
import { sampleAds, sampleCategories } from "@/lib/sample-data";
import { Ad } from "@/lib/types";
import {
  formatCurrency,
  formatRelativeTime,
  formatDate,
  getConditionLabel,
  getPlanBadgeClass,
} from "@/lib/utils";
import { useFavoritesStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const planLabels: Record<string, string> = {
  free: "Gratis",
  basic: "Basico",
  premium: "Premium",
  featured: "Destaque",
  enterprise: "Empresarial",
};

export default function AdDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { favoriteIds, addFavorite, removeFavorite } = useFavoritesStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [ad, setAd] = useState<Ad | null>(null);
  const [relatedAds, setRelatedAds] = useState<Ad[]>([]);

  // Find ad by slug
  useEffect(() => {
    const foundAd = sampleAds.find((a) => a.slug === slug);
    setAd(foundAd || null);

    if (foundAd) {
      // Find related ads (same category, different ad)
      const related = sampleAds
        .filter(
          (a) => a.categoryId === foundAd.categoryId && a.id !== foundAd.id
        )
        .slice(0, 4);
      setRelatedAds(related);
    }
  }, [slug]);

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Anuncio nao encontrado
          </h1>
          <p className="text-slate-500 mb-6">
            O anuncio que voce esta procurando nao existe ou foi removido.
          </p>
          <Link
            href="/anuncios"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Anuncios
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteIds.includes(ad.id);
  const category = sampleCategories.find((c) => c.id === ad.categoryId);
  const isPremium = ["premium", "featured", "enterprise"].includes(ad.planType);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(ad.id);
    } else {
      addFavorite(ad.id);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: ad.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? ad.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button & Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            {category && (
              <>
                <Link
                  href={`/categorias/${category.slug}`}
                  className="hover:text-blue-600"
                >
                  {category.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-slate-700">{ad.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="relative aspect-[4/3]">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={ad.images[currentImageIndex]?.url || "/placeholder-ad.jpg"}
                  alt={`${ad.title} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Plan Badge */}
                {isPremium && (
                  <span
                    className={cn(
                      "absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full",
                      getPlanBadgeClass(ad.planType)
                    )}
                  >
                    {planLabels[ad.planType]}
                  </span>
                )}

                {/* Navigation Arrows */}
                {ad.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {ad.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {ad.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                        currentImageIndex === index
                          ? "border-blue-600"
                          : "border-transparent"
                      )}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ad Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{ad.title}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={cn(
                      "p-2 rounded-xl border transition-colors",
                      isFavorite
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-slate-400"
                      )}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  {ad.price === 0 ? "Gratis" : formatCurrency(ad.price)}
                </span>
                {ad.negotiable && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Negociavel
                  </span>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="text-center">
                  <MapPin className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Localizacao</p>
                  <p className="text-sm font-medium text-slate-700">
                    {ad.location.city}, {ad.location.state}
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Publicado</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatRelativeTime(ad.createdAt)}
                  </p>
                </div>
                <div className="text-center">
                  <Eye className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Visualizacoes</p>
                  <p className="text-sm font-medium text-slate-700">{ad.views}</p>
                </div>
                {ad.condition && (
                  <div className="text-center">
                    <Tag className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">Condicao</p>
                    <p className="text-sm font-medium text-slate-700">
                      {getConditionLabel(ad.condition)}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Descricao
                </h2>
                <p className="text-slate-600 whitespace-pre-line">
                  {ad.description}
                </p>
              </div>

              {/* Tags */}
              {ad.tags && ad.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {ad.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Report Ad */}
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Encontrou algo errado?
                </span>
              </div>
              <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                <Flag className="w-4 h-4" />
                Denunciar anuncio
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {ad.contact.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                    {ad.contact.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Anunciante
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                {ad.contact.phone && ad.contact.showPhone && (
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    {showPhone ? ad.contact.phone : "Ver Telefone"}
                  </button>
                )}
                {ad.contact.whatsapp && ad.contact.showWhatsapp && (
                  <a
                    href={`https://wa.me/${ad.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Enviar Mensagem
                </button>
              </div>

              {/* Safety Tips */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-2">
                  Dicas de Seguranca
                </p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>- Nunca faca pagamentos antecipados</li>
                  <li>- Prefira encontros em locais publicos</li>
                  <li>- Verifique o produto antes de comprar</li>
                </ul>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Localizacao</h3>
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <MapPin className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-sm text-slate-600">
                {ad.location.city}, {ad.location.state}
                {ad.location.neighborhood && ` - ${ad.location.neighborhood}`}
              </p>
            </div>
          </div>
        </div>

        {/* Related Ads */}
        {relatedAds.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Anuncios Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedAds.map((relatedAd) => (
                <AdCard key={relatedAd.id} ad={relatedAd} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
