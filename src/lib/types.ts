// Payment Plans - Core of the ad display logic
export type PlanType = "free" | "basic" | "premium" | "featured" | "enterprise";

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  duration: number; // days
  features: PlanFeatures;
  displayPriority: number; // 1-100, higher = more visibility
  maxAds: number;
  isActive: boolean;
}

export interface PlanFeatures {
  // Plan limits
  maxActiveAds: number; // max number of active ads, -1 for unlimited
  adDurationDays: number; // how long ads stay active
  maxPhotosPerAd: number; // max photos per ad

  // Visibility settings
  displayProbability: number; // 0-1, probability of being shown in listings
  positionBoost: number; // multiplier for position in results
  homepageSlots: number; // number of slots on homepage
  categoryHighlight: boolean;
  searchPriority: boolean;
  highlightedAds: boolean;
  featuredInCategory: boolean;
  priorityInSearch: boolean;

  // Ad features
  maxImages: number;
  videoAllowed: boolean;
  videoSupport: boolean;
  featuredBadge: boolean;
  urgentBadge: boolean;
  verifiedBadge: boolean;

  // Extra features
  analytics: boolean;
  seoOptimization: boolean;
  socialMediaIntegration: boolean;

  // Display options
  boldTitle: boolean;
  coloredBackground: boolean;
  borderHighlight: boolean;
  largerThumbnail: boolean;

  // Extra features
  socialSharing: boolean;
  statistics: boolean;
  autoRenew: boolean;
  prioritySupport: boolean;

  // Refresh/bump options
  refreshesPerMonth: number;
  bumpToTopPerMonth: number;
}

// Ad Status
export type AdStatus = "draft" | "pending" | "active" | "paused" | "expired" | "sold" | "rejected";

// Ad Categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId?: string;
  subcategories?: Category[];
  adCount: number;
  isActive: boolean;
}

// Main Ad interface
export interface Ad {
  id: string;
  userId: string;
  planId: string;
  planType: PlanType;

  // Basic info
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  negotiable: boolean;

  // Classification
  categoryId: string;
  subcategoryId?: string;
  condition: "new" | "like_new" | "good" | "fair" | "parts";

  // Location
  location: AdLocation;

  // Media
  images: AdImage[];
  videoUrl?: string;

  // Contact
  contact: AdContact;

  // Status & Dates
  status: AdStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  expiresAt?: string;

  // Stats
  views: number;
  favorites: number;
  contacts: number;

  // Plan-based display settings (computed from plan)
  displaySettings: AdDisplaySettings;

  // Moderation
  moderationNotes?: string;
  rejectionReason?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
}

export interface AdLocation {
  country: string;
  state: string;
  city: string;
  neighborhood?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface AdContact {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  showPhone: boolean;
  showWhatsapp: boolean;
  showEmail: boolean;
}

export interface AdDisplaySettings {
  priority: number;
  displayProbability: number;
  badges: AdBadge[];
  style: AdStyle;
}

export interface AdBadge {
  type: "featured" | "urgent" | "verified" | "top" | "new";
  label: string;
  color: string;
}

export interface AdStyle {
  boldTitle: boolean;
  backgroundColor?: string;
  borderColor?: string;
  thumbnailSize: "normal" | "large";
}

// User/Advertiser
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  type: "individual" | "business";
  businessInfo?: BusinessInfo;
  currentPlanId?: string;
  currentPlan?: Plan;
  rating: number;
  totalAds: number;
  activeAds: number;
  memberSince: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface BusinessInfo {
  companyName: string;
  cnpj?: string;
  address?: string;
  website?: string;
  logo?: string;
}

// Ad Display Algorithm Types
export interface DisplayAlgorithmConfig {
  // Weight factors for different criteria (0-1)
  weights: {
    planPriority: number;
    recency: number;
    relevance: number;
    engagement: number;
    location: number;
  };

  // Homepage configuration
  homepage: {
    featuredSlots: number;
    premiumSlots: number;
    regularSlots: number;
    rotationInterval: number; // seconds
  };

  // Search configuration
  search: {
    boostPremiumPositions: number; // how many top positions reserved for premium
    mixRatio: number; // ratio of premium to regular ads
  };

  // Category page configuration
  category: {
    highlightedAds: number;
    standardAdsPerPage: number;
  };
}

export interface AdDisplayResult {
  ads: Ad[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  displayMetrics: {
    premiumAdsShown: number;
    regularAdsShown: number;
    averagePriority: number;
  };
}

// Search & Filter Types
export interface AdSearchParams {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  location?: {
    state?: string;
    city?: string;
    radius?: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  condition?: Ad["condition"][];
  sortBy?: "relevance" | "price_asc" | "price_desc" | "date_desc" | "date_asc";
  page?: number;
  pageSize?: number;
}

// Analytics Types
export interface AdAnalytics {
  adId: string;
  period: "day" | "week" | "month" | "all";
  views: number;
  uniqueViews: number;
  favorites: number;
  contacts: number;
  shares: number;
  clickThroughRate: number;
  averageViewDuration: number;
  viewsByDay: { date: string; count: number }[];
  viewsBySource: { source: string; count: number }[];
}

export interface PlatformAnalytics {
  totalAds: number;
  activeAds: number;
  totalUsers: number;
  activeUsers: number;
  adsByPlan: { plan: PlanType; count: number }[];
  adsByCategory: { category: string; count: number }[];
  revenue: {
    total: number;
    byPlan: { plan: PlanType; amount: number }[];
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: "ad_approved" | "ad_rejected" | "ad_expired" | "new_contact" | "plan_expiring" | "system";
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Transaction/Payment Types
export interface Transaction {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}
