package com.classificados.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "ads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ad {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 5000)
    private String description;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Boolean negotiable = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdStatus status = AdStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType = PlanType.FREE;

    @Column(name = "category_id", nullable = false)
    private String categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User seller;

    @ElementCollection
    @CollectionTable(name = "ad_images", joinColumns = @JoinColumn(name = "ad_id"))
    @Column(name = "image_url")
    private List<String> images;

    @Enumerated(EnumType.STRING)
    private AdCondition condition;

    // Location fields
    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String city;

    private String neighborhood;

    private String zipCode;

    // Metrics
    @Column(nullable = false)
    private Long views = 0L;

    @Column(nullable = false)
    private Long contacts = 0L;

    @Column(nullable = false)
    private Long favorites = 0L;

    // Display algorithm fields
    @Column(name = "display_score", nullable = false)
    private Double displayScore = 0.0;

    @Column(name = "position_boost", nullable = false)
    private Double positionBoost = 1.0;

    // Timestamps
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "featured_until")
    private LocalDateTime featuredUntil;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AdStatus {
        PENDING,
        ACTIVE,
        REJECTED,
        EXPIRED,
        PAUSED
    }

    public enum AdCondition {
        NEW,
        LIKE_NEW,
        GOOD,
        FAIR,
        FOR_PARTS
    }

    public enum PlanType {
        FREE,
        BASIC,
        PREMIUM,
        FEATURED,
        ENTERPRISE
    }
}
