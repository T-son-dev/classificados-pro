"use client";

import Link from "next/link";
import { Package, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { sampleCategories } from "@/lib/sample-data";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                Classificados<span className="text-blue-400">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              A maior plataforma de classificados do Brasil. Compre, venda e anuncie
              de forma simples e segura.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              {sampleCategories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Uteis</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/anunciar" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Anunciar
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Planos e Precos
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/seguranca" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Dicas de Seguranca
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Politica de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 shrink-0" />
                contato@classificadospro.com.br
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 shrink-0" />
                0800 123 4567
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 shrink-0" />
                Av. Paulista, 1000<br />
                Sao Paulo - SP, Brasil
              </li>
            </ul>

            {/* App Download */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Baixe nosso app</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="px-4 py-2 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors"
                >
                  App Store
                </a>
                <a
                  href="#"
                  className="px-4 py-2 bg-slate-800 rounded-lg text-xs hover:bg-slate-700 transition-colors"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} ClassificadosPro. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/termos" className="text-slate-400 hover:text-white text-sm transition-colors">
                Termos
              </Link>
              <Link href="/privacidade" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
