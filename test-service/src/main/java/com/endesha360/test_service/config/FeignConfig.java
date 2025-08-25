package com.endesha360.test_service.config;

import feign.RequestInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import feign.RequestTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class FeignConfig {
        @Bean
        public RequestInterceptor requestInterceptor() {
            return new RequestInterceptor() {
                private final Logger logger = LoggerFactory.getLogger(FeignConfig.class);
                @Override
                public void apply(RequestTemplate template) {
                    String jwt = null;
                    RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
                    if (requestAttributes instanceof ServletRequestAttributes) {
                        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
                        String authHeader = request.getHeader("Authorization");
                        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                            jwt = authHeader.substring(7);
                        }
                    }
                    if (StringUtils.hasText(jwt)) {
                        template.header("Authorization", "Bearer " + jwt);
                        logger.info("Forwarding JWT in Feign: {}", jwt);
                    } else {
                        logger.warn("No JWT found in HTTP request to forward in Feign");
                    }
                }
            };
    }
}
