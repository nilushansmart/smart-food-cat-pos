package com.cateringpos.service;

import com.cateringpos.dto.response.DailyIncomeReportResponse;
import com.cateringpos.dto.response.MonthlyAnalyticsResponse;

import java.time.LocalDate;

/**
 * Service interface for financial and sales analytics.
 */
public interface ReportService {

    /**
     * Aggregates completed orders, income, cash vs online metrics for a selected date.
     */
    DailyIncomeReportResponse getDailyIncomeReport(LocalDate date);

    /**
     * Aggregates monthly income, category share, and top-selling catering items.
     */
    MonthlyAnalyticsResponse getMonthlyAnalytics(int year, int month);
}

