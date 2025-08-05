package com.endesha360.UserManagementService.config;

import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            
            statement.execute("SELECT 1");
            
            return Health.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("status", "Available")
                    .withDetail("validationQuery", "SELECT 1")
                    .build();
                    
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("status", "Not Available")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
