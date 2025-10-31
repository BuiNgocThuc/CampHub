package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.category.CategoryCreationRequest;
import org.camphub.be_camphub.dto.request.category.CategoryPatchRequest;
import org.camphub.be_camphub.dto.request.category.CategoryUpdateRequest;
import org.camphub.be_camphub.dto.response.category.CategoryResponse;
import org.camphub.be_camphub.entity.Category;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.CategoryMapper;
import org.camphub.be_camphub.repository.CategoryRepository;
import org.camphub.be_camphub.service.CategoryService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    @Override
    public CategoryResponse create(CategoryCreationRequest request) {
        Category category = categoryMapper.creationRequestToEntity(request);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        categoryRepository.save(category);
        return categoryMapper.entityToResponse(category);
    }

    @Override
    public CategoryResponse update(UUID id, CategoryUpdateRequest request) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.updateRequestToEntity(category, request);
        category.setUpdatedAt(LocalDateTime.now());
        categoryRepository.save(category);

        return categoryMapper.entityToResponse(category);
    }

    @Override
    public CategoryResponse patch(UUID id, CategoryPatchRequest request) {
        Category category =
                categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.patchRequestToEntity(category, request);
        category.setUpdatedAt(LocalDateTime.now());
        categoryRepository.save(category);

        return categoryMapper.entityToResponse(category);
    }

    @Override
    public void delete(UUID id) {
        Category category = categoryRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        category.setIsDeleted(true);
        category.setUpdatedAt(LocalDateTime.now());
        categoryRepository.save(category);
    }

    @Override
    public CategoryResponse getById(UUID id) {
        Category category = categoryRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return categoryMapper.entityToResponse(category);
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAllByIsDeletedFalse().stream()
                .map(categoryMapper::entityToResponse)
                .toList();
    }
}
