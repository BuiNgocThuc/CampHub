package org.camphub.be_camphub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import org.camphub.be_camphub.enums.MediaType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Embeddable
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MediaResource {
    @Column(nullable = false)
    String url;

    @Enumerated(EnumType.STRING)
    MediaType type; // IMAGE hoặc VIDEO

    @Column(name = "file_hash", length = 64) // hash SHA-256
    String fileHash;
}
