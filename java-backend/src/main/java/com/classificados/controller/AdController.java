package com.classificados.controller;

import com.classificados.model.Ad;
import com.classificados.service.AdDisplayService;
import com.classificados.service.AdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
@RequiredArgsConstructor
@Tag(name = "Ads", description = "Ad management and display endpoints")
public class AdController {

    private final AdService adService;
    private final AdDisplayService adDisplayService;

    @GetMapping
    @Operation(summary = "Search ads with plan-based prioritization")
    public ResponseEntity<List<Ad>> searchAds(
            @Parameter(description = "Search query") @RequestParam(required = false) String q,
            @Parameter(description = "Category ID") @RequestParam(required = false) String category,
            @Parameter(description = "Minimum price") @RequestParam(required = false) Double priceMin,
            @Parameter(description = "Maximum price") @RequestParam(required = false) Double priceMax,
            @Parameter(description = "State filter") @RequestParam(required = false) String state,
            @Parameter(description = "City filter") @RequestParam(required = false) String city,
            @Parameter(description = "User's state for location scoring") @RequestParam(required = false) String userState,
            @Parameter(description = "Result limit") @RequestParam(defaultValue = "20") int limit) {

        List<Ad> ads = adDisplayService.searchAds(q, category, priceMin, priceMax, state, city, userState, limit);
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/homepage")
    @Operation(summary = "Get homepage ads organized by sections")
    public ResponseEntity<AdDisplayService.HomepageAdsResult> getHomepageAds(
            @Parameter(description = "Featured section limit") @RequestParam(defaultValue = "4") int featuredLimit,
            @Parameter(description = "Premium section limit") @RequestParam(defaultValue = "4") int premiumLimit,
            @Parameter(description = "Regular section limit") @RequestParam(defaultValue = "8") int regularLimit) {

        AdDisplayService.HomepageAdsResult result = adDisplayService.getHomepageAds(
            featuredLimit, premiumLimit, regularLimit
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get category ads with highlighted section")
    public ResponseEntity<AdDisplayService.CategoryAdsResult> getCategoryAds(
            @Parameter(description = "Category ID") @PathVariable String categoryId) {

        AdDisplayService.CategoryAdsResult result = adDisplayService.getCategoryAds(categoryId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get ad by ID")
    public ResponseEntity<Ad> getAdById(@PathVariable String id) {
        return adService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get ad by slug")
    public ResponseEntity<Ad> getAdBySlug(@PathVariable String slug) {
        return adService.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new ad")
    public ResponseEntity<Ad> createAd(@RequestBody Ad ad) {
        Ad createdAd = adService.createAd(ad);
        return ResponseEntity.ok(createdAd);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an ad")
    public ResponseEntity<Ad> updateAd(@PathVariable String id, @RequestBody Ad ad) {
        return adService.updateAd(id, ad)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an ad")
    public ResponseEntity<Void> deleteAd(@PathVariable String id) {
        adService.deleteAd(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/view")
    @Operation(summary = "Increment ad view count")
    public ResponseEntity<Void> incrementViews(@PathVariable String id) {
        adService.incrementViews(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/contact")
    @Operation(summary = "Increment ad contact count")
    public ResponseEntity<Void> incrementContacts(@PathVariable String id) {
        adService.incrementContacts(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get ads by user")
    public ResponseEntity<List<Ad>> getAdsByUser(@PathVariable String userId) {
        List<Ad> ads = adService.findByUserId(userId);
        return ResponseEntity.ok(ads);
    }

    // Admin endpoints
    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a pending ad (admin)")
    public ResponseEntity<Ad> approveAd(@PathVariable String id) {
        return adService.approveAd(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a pending ad (admin)")
    public ResponseEntity<Ad> rejectAd(
            @PathVariable String id,
            @RequestParam String reason) {
        return adService.rejectAd(id, reason)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
