package com.endesha360.questions_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController @RequestMapping("/api/uploads")
public class ImageUploadController {

    @Value("${uploads.dir:uploads}")
    private String uploadsDir; // default ./uploads

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestPart("file") MultipartFile file) throws IOException {
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext != null ? "." + ext : "");
        Path dir = Paths.get(uploadsDir, "images");
        Files.createDirectories(dir);
        Path dest = dir.resolve(filename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        // Expose via static handler or reverse proxy; for simplicity:
        String url = "/static/images/" + filename; // map below
        return Map.of("url", url);
    }
}
