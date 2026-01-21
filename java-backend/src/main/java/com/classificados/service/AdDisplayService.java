package com.classificados.service;

import com.classificados.model.Ad;
import com.classificados.model.Plan;
import com.classificados.repository.AdRepository;
import com.classificados.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsible for the ad display algorithm based on payment plans.
 * This is the core business logic for ad prioritization.
 */
@Service
@RequiredArgsConstructor
public class AdDisplayService {

    private final AdRepository adRepository;
    private final PlanRepository planRepository;

    // Plan priority scores (higher = more visibility)
    private static final Map<Ad.PlanType, Integer> PLAN_PRIORITY_SCORES = Map.of(
        Ad.PlanType.FREE, 10,
        Ad.PlanType.BASIC, 30,
        Ad.PlanType.PREMIUM, 60,
        Ad.PlanType.FEATURED, 85,
        Ad.PlanType.ENTERPRISE, 100
    );

    // Display probability by plan (0-1)
    private static final Map<Ad.PlanType, Double> PLAN_DISPLAY_PROBABILITY = Map.of(
        Ad.PlanType.FREE, 0.4,       // 40% chance to be shown
        Ad.PlanType.BASIC, 0.65,     // 65% chance
        Ad.PlanType.PREMIUM, 0.85,   // 85% chance
        Ad.PlanType.FEATURED, 0.95,  // 95% chance
        Ad.PlanType.ENTERPRISE, 1.0  // Always shown
    );

    // Position boost multipliers
    private static final Map<Ad.PlanType, Double> POSITION_BOOST_MULTIPLIERS = Map.of(
        Ad.PlanType.FREE, 1.0,
        Ad.PlanType.BASIC, 1.5,
        Ad.PlanType.PREMIUM, 2.0,
        Ad.PlanType.FEATURED, 2.5,
        Ad.PlanType.ENTERPRISE, 3.0
    );

    // Algorithm weights
    private static final double WEIGHT_PLAN_PRIORITY = 0.40;
    private static final double WEIGHT_RECENCY = 0.25;
    private static final double WEIGHT_RELEVANCE = 0.15;
    private static final double WEIGHT_ENGAGEMENT = 0.10;
    private static final double WEIGHT_LOCATION = 0.10;

    /**
     * Calculate the display score for an ad based on multiple factors.
     */
    public double calculateDisplayScore(Ad ad, String searchQuery, String userState) {
        double planScore = calculatePlanScore(ad.getPlanType());
        double recencyScore = calculateRecencyScore(ad.getCreatedAt());
        double relevanceScore = calculateRelevanceScore(ad, searchQuery);
        double engagementScore = calculateEngagementScore(ad);
        double locationScore = calculateLocationScore(ad.getState(), userState);

        double baseScore = (planScore * WEIGHT_PLAN_PRIORITY) +
                          (recencyScore * WEIGHT_RECENCY) +
                          (relevanceScore * WEIGHT_RELEVANCE) +
                          (engagementScore * WEIGHT_ENGAGEMENT) +
                          (locationScore * WEIGHT_LOCATION);

        // Apply position boost multiplier
        double boost = POSITION_BOOST_MULTIPLIERS.getOrDefault(ad.getPlanType(), 1.0);

        return baseScore * boost;
    }

    /**
     * Calculate plan priority score (0-100).
     */
    private double calculatePlanScore(Ad.PlanType planType) {
        return PLAN_PRIORITY_SCORES.getOrDefault(planType, 10).doubleValue();
    }

    /**
     * Calculate recency score based on ad creation date (0-100).
     */
    private double calculateRecencyScore(LocalDateTime createdAt) {
        long daysOld = ChronoUnit.DAYS.between(createdAt, LocalDateTime.now());
        // Decay over 30 days, minimum score of 10
        return Math.max(10, 100 - (daysOld * 3));
    }

    /**
     * Calculate relevance score based on search query match (0-100).
     */
    private double calculateRelevanceScore(Ad ad, String searchQuery) {
        if (searchQuery == null || searchQuery.isBlank()) {
            return 50; // Neutral score if no search query
        }

        String query = searchQuery.toLowerCase();
        String title = ad.getTitle().toLowerCase();
        String description = ad.getDescription() != null ? ad.getDescription().toLowerCase() : "";

        // Exact title match
        if (title.equals(query)) {
            return 100;
        }

        // Title contains query
        if (title.contains(query)) {
            return 80;
        }

        // Check word matches
        String[] queryWords = query.split("\\s+");
        long matchingWords = Arrays.stream(queryWords)
                .filter(word -> title.contains(word) || description.contains(word))
                .count();

        return Math.min(100, (matchingWords * 20) + 20);
    }

    /**
     * Calculate engagement score based on views, contacts, favorites (0-100).
     */
    private double calculateEngagementScore(Ad ad) {
        // Normalize based on expected maximums
        double viewScore = Math.min(100, (ad.getViews() / 1000.0) * 100);
        double contactScore = Math.min(100, (ad.getContacts() / 50.0) * 100);
        double favoriteScore = Math.min(100, (ad.getFavorites() / 100.0) * 100);

        return (viewScore * 0.4) + (contactScore * 0.35) + (favoriteScore * 0.25);
    }

    /**
     * Calculate location score based on proximity (0-100).
     */
    private double calculateLocationScore(String adState, String userState) {
        if (userState == null || userState.isBlank()) {
            return 50; // Neutral score if no user location
        }
        return adState.equalsIgnoreCase(userState) ? 100 : 30;
    }

    /**
     * Determine if an ad should be displayed based on plan probability.
     */
    public boolean shouldDisplayAd(Ad ad) {
        // Enterprise ads are always shown
        if (ad.getPlanType() == Ad.PlanType.ENTERPRISE) {
            return true;
        }

        // Featured ads have 95% chance
        double probability = PLAN_DISPLAY_PROBABILITY.getOrDefault(ad.getPlanType(), 0.4);
        return Math.random() < probability;
    }

    /**
     * Get ads for homepage, organized by sections.
     */
    public HomepageAdsResult getHomepageAds(int featuredLimit, int premiumLimit, int regularLimit) {
        List<Ad> activeAds = adRepository.findByStatus(Ad.AdStatus.ACTIVE);

        // Featured section: Enterprise and Featured plans
        List<Ad> featuredAds = activeAds.stream()
                .filter(ad -> ad.getPlanType() == Ad.PlanType.ENTERPRISE ||
                             ad.getPlanType() == Ad.PlanType.FEATURED)
                .filter(this::shouldDisplayAd)
                .sorted((a, b) -> Double.compare(
                    calculateDisplayScore(b, null, null),
                    calculateDisplayScore(a, null, null)
                ))
                .limit(featuredLimit)
                .collect(Collectors.toList());

        // Premium section: Premium plan
        List<Ad> premiumAds = activeAds.stream()
                .filter(ad -> ad.getPlanType() == Ad.PlanType.PREMIUM)
                .filter(this::shouldDisplayAd)
                .sorted((a, b) -> Double.compare(
                    calculateDisplayScore(b, null, null),
                    calculateDisplayScore(a, null, null)
                ))
                .limit(premiumLimit)
                .collect(Collectors.toList());

        // Regular section: Basic and Free plans (filtered by probability)
        List<Ad> regularAds = activeAds.stream()
                .filter(ad -> ad.getPlanType() == Ad.PlanType.BASIC ||
                             ad.getPlanType() == Ad.PlanType.FREE)
                .filter(this::shouldDisplayAd)
                .sorted((a, b) -> Double.compare(
                    calculateDisplayScore(b, null, null),
                    calculateDisplayScore(a, null, null)
                ))
                .limit(regularLimit)
                .collect(Collectors.toList());

        return new HomepageAdsResult(featuredAds, premiumAds, regularAds);
    }

    /**
     * Search ads with plan-based prioritization.
     */
    public List<Ad> searchAds(String query, String categoryId, Double priceMin,
                              Double priceMax, String state, String city,
                              String userState, int limit) {
        // Get all active ads matching basic criteria
        List<Ad> ads = adRepository.findActiveAdsByFilters(categoryId, priceMin, priceMax, state, city);

        // Calculate scores and filter by display probability
        List<ScoredAd> scoredAds = ads.stream()
                .filter(this::shouldDisplayAd)
                .map(ad -> new ScoredAd(ad, calculateDisplayScore(ad, query, userState)))
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .collect(Collectors.toList());

        // Mix premium ads at top positions
        List<Ad> results = new ArrayList<>();
        int premiumPositions = Math.min(3, (int) Math.ceil(limit * 0.25));

        // Get premium ads for top positions
        List<Ad> premiumAds = scoredAds.stream()
                .filter(sa -> sa.ad.getPlanType() == Ad.PlanType.PREMIUM ||
                             sa.ad.getPlanType() == Ad.PlanType.FEATURED ||
                             sa.ad.getPlanType() == Ad.PlanType.ENTERPRISE)
                .limit(premiumPositions)
                .map(sa -> sa.ad)
                .collect(Collectors.toList());

        // Get remaining ads
        Set<String> premiumIds = premiumAds.stream()
                .map(Ad::getId)
                .collect(Collectors.toSet());

        List<Ad> remainingAds = scoredAds.stream()
                .filter(sa -> !premiumIds.contains(sa.ad.getId()))
                .limit(limit - premiumAds.size())
                .map(sa -> sa.ad)
                .collect(Collectors.toList());

        results.addAll(premiumAds);
        results.addAll(remainingAds);

        return results.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Get ads for a category page with highlighted section.
     */
    public CategoryAdsResult getCategoryAds(String categoryId) {
        List<Ad> categoryAds = adRepository.findByStatusAndCategoryId(Ad.AdStatus.ACTIVE, categoryId);

        // Highlighted: Premium+ plans
        List<Ad> highlightedAds = categoryAds.stream()
                .filter(ad -> ad.getPlanType() == Ad.PlanType.PREMIUM ||
                             ad.getPlanType() == Ad.PlanType.FEATURED ||
                             ad.getPlanType() == Ad.PlanType.ENTERPRISE)
                .filter(this::shouldDisplayAd)
                .sorted((a, b) -> Double.compare(
                    calculateDisplayScore(b, null, null),
                    calculateDisplayScore(a, null, null)
                ))
                .collect(Collectors.toList());

        // Regular ads
        List<Ad> regularAds = categoryAds.stream()
                .filter(ad -> ad.getPlanType() == Ad.PlanType.BASIC ||
                             ad.getPlanType() == Ad.PlanType.FREE)
                .filter(this::shouldDisplayAd)
                .sorted((a, b) -> Double.compare(
                    calculateDisplayScore(b, null, null),
                    calculateDisplayScore(a, null, null)
                ))
                .collect(Collectors.toList());

        return new CategoryAdsResult(highlightedAds, regularAds);
    }

    // Helper classes
    public record HomepageAdsResult(List<Ad> featuredAds, List<Ad> premiumAds, List<Ad> regularAds) {}
    public record CategoryAdsResult(List<Ad> highlightedAds, List<Ad> regularAds) {}
    private record ScoredAd(Ad ad, double score) {}
}
