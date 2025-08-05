package com.endesha360.UserManagementService.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public Counter authenticationSuccessCounter(MeterRegistry meterRegistry) {
        return Counter.builder("authentication.success")
                .description("Number of successful authentications")
                .tag("service", "user-management")
                .register(meterRegistry);
    }

    @Bean
    public Counter authenticationFailureCounter(MeterRegistry meterRegistry) {
        return Counter.builder("authentication.failure")
                .description("Number of failed authentications")
                .tag("service", "user-management")
                .register(meterRegistry);
    }

    @Bean
    public Timer authenticationTimer(MeterRegistry meterRegistry) {
        return Timer.builder("authentication.duration")
                .description("Authentication processing time")
                .tag("service", "user-management")
                .register(meterRegistry);
    }

    @Bean
    public Counter userRegistrationCounter(MeterRegistry meterRegistry) {
        return Counter.builder("user.registration")
                .description("Number of user registrations")
                .tag("service", "user-management")
                .register(meterRegistry);
    }

    @Bean
    public Counter userLoginCounter(MeterRegistry meterRegistry) {
        return Counter.builder("user.login")
                .description("Number of user logins")
                .tag("service", "user-management")
                .register(meterRegistry);
    }
}
