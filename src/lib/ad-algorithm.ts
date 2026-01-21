/**
 * Ad Display Algorithm
 *
 * This module implements the core logic for displaying ads based on payment plans.
 * It handles:
 * - Priority-based sorting and display probability
 * - Plan-specific visibility rules
 * - Position boosting for premium plans
 * - Fair distribution with premium preference
 * - Homepage, search, and category page display logic
 */

import type { Ad, Plan, PlanType, AdSearchParams, AdDisplayResult, DisplayAlgorithmConfig } from "./types";

// Default algorithm configuration
export const defaultAlgorithmConfig: DisplayAlgorithmConfig = {
  weights: {
    planPriority: 0.4,    // 40% weight for plan level
    recency: 0.25,        // 25% weight for how recent the ad is
    relevance: 0.2,       // 20% weight for search relevance
    engagement: 0.1,      // 10% weight for views/favorites
    location: 0.05,       // 5% weight for location proximity
  },
  homepage: {
    featuredSlots: 4,     // Top featured section
    premiumSlots: 8,      // Premium ads section
    regularSlots: 12,     // Regular ads below
    rotationInterval: 30, // Rotate featured every 30 seconds
  },
  search: {
    boostPremiumPositions: 3, // First 3 positions prioritize premium
    mixRatio: 0.3,            // 30% premium ads mixed in results
  },
  category: {
    highlightedAds: 4,        // Highlighted ads at top of category
    standardAdsPerPage: 20,
  },
};

// Plan priority scores (higher = more visibility)
export const planPriorityScores: Record<PlanType, number> = {
  free: 10,
  basic: 30,
  premium: 60,
  featured: 85,
  enterprise: 100,
};

// Display probability by plan (0-1)
export const planDisplayProbability: Record<PlanType, number> = {
  free: 0.4,      // 40% chance to be shown in general listings
  basic: 0.65,    // 65% chance
  premium: 0.85,  // 85% chance
  featured: 0.95, // 95% chance
  enterprise: 1.0, // Always shown
};

/**
 * Calculate the display score for an ad
 * This score determines the ad's position in listings
 */
export function calculateDisplayScore(
  ad: Ad,
  config: DisplayAlgorithmConfig = defaultAlgorithmConfig,
  searchQuery?: string,
  userLocation?: { lat: number; lng: number }
): number {
  const { weights } = config;

  // 1. Plan Priority Score (0-100)
  const planScore = planPriorityScores[ad.planType] || 10;

  // 2. Recency Score (0-100) - newer ads get higher scores
  const ageInDays = ad.publishedAt
    ? (Date.now() - new Date(ad.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    : 999;
  const recencyScore = Math.max(0, 100 - ageInDays * 2); // Lose 2 points per day

  // 3. Relevance Score (0-100) - based on search query match
  let relevanceScore = 50; // Default middle score
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const titleMatch = ad.title.toLowerCase().includes(query);
    const descMatch = ad.description.toLowerCase().includes(query);
    const tagMatch = ad.tags.some((tag) => tag.toLowerCase().includes(query));
    relevanceScore = (titleMatch ? 50 : 0) + (descMatch ? 30 : 0) + (tagMatch ? 20 : 0);
  }

  // 4. Engagement Score (0-100) - based on views and favorites
  const engagementScore = Math.min(100, (ad.views * 0.1 + ad.favorites * 2 + ad.contacts * 5));

  // 5. Location Score (0-100) - based on distance from user
  let locationScore = 50; // Default
  if (userLocation && ad.location.latitude && ad.location.longitude) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      ad.location.latitude,
      ad.location.longitude
    );
    locationScore = Math.max(0, 100 - distance / 10); // Lose points for every 10km
  }

  // Calculate weighted final score
  const finalScore =
    planScore * weights.planPriority +
    recencyScore * weights.recency +
    relevanceScore * weights.relevance +
    engagementScore * weights.engagement +
    locationScore * weights.location;

  // Apply plan-specific position boost
  const positionBoost = ad.displaySettings?.priority || 1;

  return finalScore * positionBoost;
}

/**
 * Determine if an ad should be displayed based on its plan's probability
 */
export function shouldDisplayAd(ad: Ad): boolean {
  const probability = planDisplayProbability[ad.planType] || 0.4;
  return Math.random() < probability;
}

/**
 * Filter and sort ads for homepage display
 */
export function getHomepageAds(
  allAds: Ad[],
  config: DisplayAlgorithmConfig = defaultAlgorithmConfig
): {
  featured: Ad[];
  premium: Ad[];
  regular: Ad[];
} {
  // Only active ads
  const activeAds = allAds.filter((ad) => ad.status === "active");

  // Separate by plan type
  const featuredAds = activeAds.filter(
    (ad) => ad.planType === "featured" || ad.planType === "enterprise"
  );
  const premiumAds = activeAds.filter((ad) => ad.planType === "premium");
  const regularAds = activeAds.filter(
    (ad) => ad.planType === "basic" || ad.planType === "free"
  );

  // Sort each group by display score
  const sortByScore = (ads: Ad[]) =>
    ads
      .map((ad) => ({ ad, score: calculateDisplayScore(ad, config) }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.ad);

  // Apply probability filter to regular ads
  const filteredRegular = regularAds.filter(shouldDisplayAd);

  return {
    featured: sortByScore(featuredAds).slice(0, config.homepage.featuredSlots),
    premium: sortByScore(premiumAds).slice(0, config.homepage.premiumSlots),
    regular: sortByScore(filteredRegular).slice(0, config.homepage.regularSlots),
  };
}

/**
 * Search and filter ads with plan-based prioritization
 */
export function searchAds(
  allAds: Ad[],
  params: AdSearchParams,
  config: DisplayAlgorithmConfig = defaultAlgorithmConfig
): AdDisplayResult {
  let filteredAds = allAds.filter((ad) => ad.status === "active");

  // Apply filters
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredAds = filteredAds.filter(
      (ad) =>
        ad.title.toLowerCase().includes(query) ||
        ad.description.toLowerCase().includes(query) ||
        ad.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (params.categoryId) {
    filteredAds = filteredAds.filter((ad) => ad.categoryId === params.categoryId);
  }

  if (params.subcategoryId) {
    filteredAds = filteredAds.filter((ad) => ad.subcategoryId === params.subcategoryId);
  }

  if (params.location?.state) {
    filteredAds = filteredAds.filter((ad) => ad.location.state === params.location?.state);
  }

  if (params.location?.city) {
    filteredAds = filteredAds.filter((ad) => ad.location.city === params.location?.city);
  }

  if (params.priceRange?.min !== undefined) {
    filteredAds = filteredAds.filter((ad) => ad.price >= (params.priceRange?.min || 0));
  }

  if (params.priceRange?.max !== undefined) {
    filteredAds = filteredAds.filter((ad) => ad.price <= (params.priceRange?.max || Infinity));
  }

  if (params.condition && params.condition.length > 0) {
    filteredAds = filteredAds.filter((ad) => params.condition?.includes(ad.condition));
  }

  // Apply display probability filter for free/basic ads
  filteredAds = filteredAds.filter((ad) => {
    if (ad.planType === "premium" || ad.planType === "featured" || ad.planType === "enterprise") {
      return true; // Always include premium+
    }
    return shouldDisplayAd(ad);
  });

  // Calculate scores and sort
  const scoredAds = filteredAds.map((ad) => ({
    ad,
    score: calculateDisplayScore(ad, config, params.query),
  }));

  // Sort based on sortBy parameter
  switch (params.sortBy) {
    case "price_asc":
      scoredAds.sort((a, b) => a.ad.price - b.ad.price);
      break;
    case "price_desc":
      scoredAds.sort((a, b) => b.ad.price - a.ad.price);
      break;
    case "date_desc":
      scoredAds.sort(
        (a, b) =>
          new Date(b.ad.publishedAt || b.ad.createdAt).getTime() -
          new Date(a.ad.publishedAt || a.ad.createdAt).getTime()
      );
      break;
    case "date_asc":
      scoredAds.sort(
        (a, b) =>
          new Date(a.ad.publishedAt || a.ad.createdAt).getTime() -
          new Date(b.ad.publishedAt || b.ad.createdAt).getTime()
      );
      break;
    case "relevance":
    default:
      // Premium boost: Ensure top positions have premium ads
      const premiumAds = scoredAds.filter(
        (item) =>
          item.ad.planType === "premium" ||
          item.ad.planType === "featured" ||
          item.ad.planType === "enterprise"
      );
      const otherAds = scoredAds.filter(
        (item) =>
          item.ad.planType !== "premium" &&
          item.ad.planType !== "featured" &&
          item.ad.planType !== "enterprise"
      );

      // Sort each group by score
      premiumAds.sort((a, b) => b.score - a.score);
      otherAds.sort((a, b) => b.score - a.score);

      // Mix: Take top premium ads first, then interleave
      const boostedPositions = config.search.boostPremiumPositions;
      const topPremium = premiumAds.slice(0, boostedPositions);
      const remainingPremium = premiumAds.slice(boostedPositions);

      // Interleave remaining based on mix ratio
      const mixed: typeof scoredAds = [...topPremium];
      let premiumIndex = 0;
      let otherIndex = 0;

      while (premiumIndex < remainingPremium.length || otherIndex < otherAds.length) {
        if (premiumIndex < remainingPremium.length && Math.random() < config.search.mixRatio) {
          mixed.push(remainingPremium[premiumIndex++]);
        } else if (otherIndex < otherAds.length) {
          mixed.push(otherAds[otherIndex++]);
        } else if (premiumIndex < remainingPremium.length) {
          mixed.push(remainingPremium[premiumIndex++]);
        }
      }

      scoredAds.length = 0;
      scoredAds.push(...mixed);
      break;
  }

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const startIndex = (page - 1) * pageSize;
  const paginatedAds = scoredAds.slice(startIndex, startIndex + pageSize);

  // Calculate metrics
  const premiumAdsShown = paginatedAds.filter(
    (item) =>
      item.ad.planType === "premium" ||
      item.ad.planType === "featured" ||
      item.ad.planType === "enterprise"
  ).length;

  return {
    ads: paginatedAds.map((item) => item.ad),
    totalCount: scoredAds.length,
    page,
    pageSize,
    hasMore: startIndex + pageSize < scoredAds.length,
    displayMetrics: {
      premiumAdsShown,
      regularAdsShown: paginatedAds.length - premiumAdsShown,
      averagePriority:
        paginatedAds.reduce((sum, item) => sum + item.score, 0) / paginatedAds.length || 0,
    },
  };
}

/**
 * Get ads for a specific category with highlighting
 */
export function getCategoryAds(
  allAds: Ad[],
  categoryId: string,
  config: DisplayAlgorithmConfig = defaultAlgorithmConfig,
  page: number = 1
): {
  highlighted: Ad[];
  standard: AdDisplayResult;
} {
  const categoryAds = allAds.filter(
    (ad) => ad.status === "active" && ad.categoryId === categoryId
  );

  // Get highlighted ads (featured/enterprise only)
  const highlightedAds = categoryAds
    .filter((ad) => ad.planType === "featured" || ad.planType === "enterprise")
    .map((ad) => ({ ad, score: calculateDisplayScore(ad, config) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, config.category.highlightedAds)
    .map((item) => item.ad);

  // Get standard ads (excluding highlighted)
  const highlightedIds = new Set(highlightedAds.map((ad) => ad.id));
  const standardAds = categoryAds.filter((ad) => !highlightedIds.has(ad.id));

  const standard = searchAds(
    standardAds,
    { page, pageSize: config.category.standardAdsPerPage },
    config
  );

  return {
    highlighted: highlightedAds,
    standard,
  };
}

/**
 * Get similar/related ads based on category and plan priority
 */
export function getSimilarAds(
  allAds: Ad[],
  currentAd: Ad,
  limit: number = 6
): Ad[] {
  // Filter to same category, excluding current ad
  const similarAds = allAds.filter(
    (ad) =>
      ad.status === "active" &&
      ad.id !== currentAd.id &&
      ad.categoryId === currentAd.categoryId
  );

  // Score and sort with preference for premium
  const scored = similarAds
    .map((ad) => ({
      ad,
      score: calculateDisplayScore(ad) + (ad.subcategoryId === currentAd.subcategoryId ? 20 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.ad);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get rotation index for homepage featured ads
 * Used to rotate which featured ads are shown
 */
export function getFeaturedRotationIndex(
  totalFeatured: number,
  slotsToShow: number,
  intervalSeconds: number
): number {
  const now = Math.floor(Date.now() / 1000);
  const rotations = Math.floor(now / intervalSeconds);
  return (rotations * slotsToShow) % totalFeatured;
}
