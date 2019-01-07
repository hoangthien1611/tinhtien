package com.mgmtp.internship.tntbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private long id;
    private long personId;
    private String name;
    private double amount;
    private Date createdDate;
}
