import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClassificadosPro - A Maior Plataforma de Classificados do Brasil",
  description:
    "Compre, venda e anuncie de forma simples e segura. Milhares de anuncios em diversas categorias: veiculos, imoveis, eletronicos e muito mais.",
  keywords: [
    "classificados",
    "anuncios",
    "comprar",
    "vender",
    "marketplace",
    "brasil",
  ],
  authors: [{ name: "ClassificadosPro" }],
  openGraph: {
    title: "ClassificadosPro - Classificados Online",
    description: "A maior plataforma de classificados do Brasil",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
