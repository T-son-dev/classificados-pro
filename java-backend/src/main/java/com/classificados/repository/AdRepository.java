package com.classificados.repository;

import com.classificados.model.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdRepository extends JpaRepository<Ad, String> {

    Optional<Ad> findBySlug(String slug);

    List<Ad> findByStatus(Ad.AdStatus status);

    List<Ad> findByStatusAndCategoryId(Ad.AdStatus status, String categoryId);

    List<Ad> findBySellerIdAndStatus(String userId, Ad.AdStatus status);

    List<Ad> findBySellerId(String userId);

    @Query("SELECT a FROM Ad a WHERE a.status = 'ACTIVE' " +
           "AND (:categoryId IS NULL OR a.categoryId = :categoryId) " +
           "AND (:priceMin IS NULL OR a.price >= :priceMin) " +
           "AND (:priceMax IS NULL OR a.price <= :priceMax) " +
           "AND (:state IS NULL OR a.state = :state) " +
           "AND (:city IS NULL OR a.city = :city)")
    List<Ad> findActiveAdsByFilters(
        @Param("categoryId") String categoryId,
        @Param("priceMin") Double priceMin,
        @Param("priceMax") Double priceMax,
        @Param("state") String state,
        @Param("city") String city
    );

    @Query("SELECT a FROM Ad a WHERE a.status = 'ACTIVE' AND a.planType IN :planTypes ORDER BY a.displayScore DESC")
    List<Ad> findActiveAdsByPlanTypes(@Param("planTypes") List<Ad.PlanType> planTypes);

    @Query("SELECT COUNT(a) FROM Ad a WHERE a.sellerId = :userId AND a.status = 'ACTIVE'")
    long countActiveAdsByUser(@Param("userId") String userId);

    @Query("SELECT a FROM Ad a WHERE a.status = 'PENDING' ORDER BY a.createdAt ASC")
    List<Ad> findPendingAds();
}
