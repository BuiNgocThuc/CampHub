package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.category.CategoryCreationRequest;
import org.camphub.be_camphub.dto.request.category.CategoryPatchRequest;
import org.camphub.be_camphub.dto.request.category.CategoryUpdateRequest;
import org.camphub.be_camphub.dto.response.category.CategoryResponse;

public interface CategoryService {
    CategoryResponse create(CategoryCreationRequest request);

    CategoryResponse update(UUID id, CategoryUpdateRequest request);

    CategoryResponse patch(UUID id, CategoryPatchRequest request);

    void delete(UUID id);

    CategoryResponse getById(UUID id);

    List<CategoryResponse> getAll();
}
