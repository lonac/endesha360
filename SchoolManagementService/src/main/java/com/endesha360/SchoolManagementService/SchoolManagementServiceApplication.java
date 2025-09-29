package com.endesha360.SchoolManagementService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SchoolManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolManagementServiceApplication.class, args);
	}

}
