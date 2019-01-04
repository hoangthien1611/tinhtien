package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.PaymentDTO;
import com.mgmtp.internship.tntbe.services.ActivityService;
import com.mgmtp.internship.tntbe.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @Autowired
    ActivityService activityService;

    @GetMapping("/{url}")
    public List<PaymentDTO> getList(@PathVariable String url) {
        ActivityDTO activity = activityService.getActivityWithPersonAndExpense(url);
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Activity doesn't exist!");
        }
        return paymentService.getPayments(activity);
    }
}