package com.endesha360.UserManagementService.config;

import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public class RedisHealthIndicator implements HealthIndicator {

    private final RedisConnectionFactory redisConnectionFactory;

    public RedisHealthIndicator(RedisConnectionFactory redisConnectionFactory) {
        this.redisConnectionFactory = redisConnectionFactory;
    }

    @Override
    public Health health() {
        try {
            RedisConnection connection = redisConnectionFactory.getConnection();
            if (connection != null) {
                connection.ping();
                connection.close();
                return Health.up()
                        .withDetail("redis", "Available")
                        .withDetail("database", "0")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("redis", "Not Available")
                    .withDetail("error", e.getMessage())
                    .build();
        }
        return Health.down()
                .withDetail("redis", "Connection failed")
                .build();
    }
}
