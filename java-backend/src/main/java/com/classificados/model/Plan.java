package com.classificados.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Entity
@Table(name = "plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private PlanType type;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    // Plan features
    @Column(name = "max_active_ads", nullable = false)
    private Integer maxActiveAds;

    @Column(name = "ad_duration_days", nullable = false)
    private Integer adDurationDays;

    @Column(name = "max_photos_per_ad", nullable = false)
    private Integer maxPhotosPerAd;

    @Column(name = "highlighted_ads", nullable = false)
    private Boolean highlightedAds = false;

    @Column(name = "featured_in_category", nullable = false)
    private Boolean featuredInCategory = false;

    @Column(name = "priority_in_search", nullable = false)
    private Boolean priorityInSearch = false;

    @Column(name = "video_support", nullable = false)
    private Boolean videoSupport = false;

    @Column(name = "analytics", nullable = false)
    private Boolean analytics = false;

    @Column(name = "priority_support", nullable = false)
    private Boolean prioritySupport = false;

    @Column(name = "seo_optimization", nullable = false)
    private Boolean seoOptimization = false;

    @Column(name = "social_media_integration", nullable = false)
    private Boolean socialMediaIntegration = false;

    // Display algorithm configuration
    @Column(name = "display_probability", nullable = false)
    private Double displayProbability;

    @Column(name = "position_boost_multiplier", nullable = false)
    private Double positionBoostMultiplier;

    @Column(name = "priority_score", nullable = false)
    private Integer priorityScore;

    @Column(nullable = false)
    private Boolean highlighted = false;

    @Column(nullable = false)
    private Boolean active = true;

    public enum PlanType {
        FREE,
        BASIC,
        PREMIUM,
        FEATURED,
        ENTERPRISE
    }
}
