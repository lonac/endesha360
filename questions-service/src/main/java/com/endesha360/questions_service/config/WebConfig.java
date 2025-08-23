package com.endesha360.questions_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${uploads.dir:uploads}")
    private String uploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadsDir, "images").toAbsolutePath();
        registry.addResourceHandler("/static/images/**")
                .addResourceLocations("file:" + uploadPath.toString() + "/");
    }
}
