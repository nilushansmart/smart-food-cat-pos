package com.cateringpos.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "prep_time_minutes")
    @Builder.Default
    private Integer prepTimeMinutes = 10;

    @Column(length = 50)
    @Builder.Default
    private String pax = "Single Portion";

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(name = "branch_id", length = 50)
    @Builder.Default
    private String branchId = "MAIN";
}

