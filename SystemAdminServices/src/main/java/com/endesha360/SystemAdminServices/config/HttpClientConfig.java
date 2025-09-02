package com.endesha360.SystemAdminServices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration for HTTP client beans
 */
@Configuration
public class HttpClientConfig {
    
    /**
     * Bean for RestTemplate to communicate with other microservices
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
