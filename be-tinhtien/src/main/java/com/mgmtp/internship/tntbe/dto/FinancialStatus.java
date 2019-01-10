package com.mgmtp.internship.tntbe.dto;

import lombok.Data;

@Data
public class FinancialStatus {
    private double paid;
    private double shouldPay;

    public void addPaid(double addValue) {
        this.paid += addValue;
    }

    public void addShouldPay(double addValue) {
        this.shouldPay += addValue;
    }
}
