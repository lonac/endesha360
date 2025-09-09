package com.endesha360.SystemAdminServices.controller;

import com.endesha360.SystemAdminServices.service.FinancialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@Tag(name = "Financial Management", description = "Financial statistics and data endpoints")
@SecurityRequirement(name = "bearerAuth")
public class FinancialStatisticsController {

    private static final Logger logger = LoggerFactory.getLogger(FinancialStatisticsController.class);

    @Autowired
    private FinancialService financialService;

}
