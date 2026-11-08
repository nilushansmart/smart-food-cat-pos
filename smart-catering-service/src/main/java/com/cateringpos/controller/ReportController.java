package com.cateringpos.controller;

import com.cateringpos.dto.ApiResponse;
import com.cateringpos.dto.response.DailyIncomeReportResponse;
import com.cateringpos.dto.response.MonthlyAnalyticsResponse;
import com.cateringpos.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Reports & Analytics", description = "Financial income tracking, daily reports, and monthly category breakdown (Admin only)")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/daily")
    @Operation(summary = "Daily income and sales summary for a given date")
    public ResponseEntity<ApiResponse<DailyIncomeReportResponse>> getDailyIncomeReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        if (date == null) {
            date = LocalDate.now();
        }
        DailyIncomeReportResponse report = reportService.getDailyIncomeReport(date);
        return ResponseEntity.ok(ApiResponse.ok(report));
    }

    @GetMapping("/monthly")
    @Operation(summary = "Monthly financial analytics, category sales breakdown, and top-selling items")
    public ResponseEntity<ApiResponse<MonthlyAnalyticsResponse>> getMonthlyAnalytics(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null && year > 2000) ? year : now.getYear();
        int targetMonth = (month != null && month >= 1 && month <= 12) ? month : now.getMonthValue();

        MonthlyAnalyticsResponse analytics = reportService.getMonthlyAnalytics(targetYear, targetMonth);
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }
}

