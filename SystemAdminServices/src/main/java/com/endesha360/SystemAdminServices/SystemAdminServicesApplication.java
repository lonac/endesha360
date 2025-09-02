package com.endesha360.SystemAdminServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SystemAdminServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(SystemAdminServicesApplication.class, args);
	}

}
