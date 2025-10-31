package org.camphub.be_camphub.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    Map uploadFile(MultipartFile file);
}
