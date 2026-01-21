import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "BRL",
  locale: string = "pt-BR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, locale: string = "pt-BR"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(
    "pt-BR",
    options || {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(d);
  if (days > 1) return `${days} dias atrás`;
  if (days === 1) return "Ontem";
  if (hours > 1) return `${hours} horas atrás`;
  if (hours === 1) return "1 hora atrás";
  if (minutes > 1) return `${minutes} minutos atrás`;
  if (minutes === 1) return "1 minuto atrás";
  return "Agora mesmo";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: "Novo",
    like_new: "Seminovo",
    good: "Bom estado",
    fair: "Usado",
    parts: "Para peças",
  };
  return labels[condition] || condition;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    pending: "Pendente",
    active: "Ativo",
    paused: "Pausado",
    expired: "Expirado",
    sold: "Vendido",
    rejected: "Rejeitado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-amber-100 text-amber-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-blue-100 text-blue-700",
    expired: "bg-red-100 text-red-700",
    sold: "bg-purple-100 text-purple-700",
    rejected: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getPlanColor(planType: string): { bg: string; text: string; border: string } {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    free: { bg: "#f3f4f6", text: "#4b5563", border: "#d1d5db" },
    basic: { bg: "#dbeafe", text: "#2563eb", border: "#93c5fd" },
    premium: { bg: "#ede9fe", text: "#7c3aed", border: "#a78bfa" },
    featured: { bg: "#fef3c7", text: "#d97706", border: "#fbbf24" },
    enterprise: { bg: "#fee2e2", text: "#dc2626", border: "#f87171" },
  };
  return colors[planType] || colors.free;
}

export function getPlanBadgeStyle(planType: string): { bg: string; text: string; border: string } {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    free: { bg: "#f9fafb", text: "#4b5563", border: "#d1d5db" },
    basic: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
    premium: { bg: "#f5f3ff", text: "#7c3aed", border: "#c4b5fd" },
    featured: { bg: "#fffbeb", text: "#d97706", border: "#fcd34d" },
    enterprise: { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" },
  };
  return styles[planType] || styles.free;
}

export function getPlanBadgeClass(planType: string): string {
  const classes: Record<string, string> = {
    free: "badge-free",
    basic: "badge-basic",
    premium: "badge-premium",
    featured: "badge-featured",
    enterprise: "badge-enterprise",
  };
  return classes[planType] || classes.free;
}

// Calculate days until expiration
export function getDaysUntilExpiration(expiresAt: string): number {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Format phone number for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Format WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const fullNumber = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${fullNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
