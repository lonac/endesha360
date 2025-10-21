package com.endesha360.SchoolManagementService.config;

import com.endesha360.SchoolManagementService.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/debug/**").permitAll()  // Debug endpoints - remove in production
                // SystemAdminServices integration endpoints
                .requestMatchers("/api/schools/pending").permitAll()  // Get pending schools
                .requestMatchers("/api/schools/all").permitAll()  // Get all schools
                .requestMatchers("/api/schools/*/approve").permitAll()  // Approve school
                .requestMatchers("/api/schools/*/reject").permitAll()  // Reject school
                .requestMatchers("/api/schools/*").permitAll()  // Get school by ID
                .requestMatchers("/api/schools/tenant/**").permitAll()  // Get school by tenant code
                // Marketing profile public endpoints
                .requestMatchers("/api/schools/marketing/public/**").permitAll()  // Public school directory
                // Authenticated endpoints
                .requestMatchers("/api/schools/register").authenticated()  // School registration
                .requestMatchers("/api/schools/my-school").authenticated()  // Owner's school management
                .requestMatchers("/api/schools/marketing/**").authenticated()  // Marketing profile management
                .requestMatchers("/api/schools/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")  // Admin endpoints
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
