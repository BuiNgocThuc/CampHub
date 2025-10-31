package org.camphub.be_camphub.dto.response;

import java.io.Serializable;
import java.util.Collections;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> implements Serializable {
    int totalPages;
    long totalElements;
    int pageSize;
    int page;

    @Builder.Default
    java.util.List<T> data = Collections.emptyList();
}
