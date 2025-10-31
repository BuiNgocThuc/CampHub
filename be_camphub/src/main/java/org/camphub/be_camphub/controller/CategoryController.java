package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.category.CategoryCreationRequest;
import org.camphub.be_camphub.dto.request.category.CategoryPatchRequest;
import org.camphub.be_camphub.dto.request.category.CategoryUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.category.CategoryResponse;
import org.camphub.be_camphub.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping
    ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryCreationRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Create category successfully")
                .result(categoryService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CategoryResponse> updateCategory(
            @PathVariable("id") UUID id, @RequestBody CategoryUpdateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Update category successfully")
                .result(categoryService.update(id, request))
                .build();
    }

    @PatchMapping("/{id}")
    ApiResponse<CategoryResponse> patchCategory(
            @PathVariable("id") UUID id, @RequestBody CategoryPatchRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Patch category successfully")
                .result(categoryService.patch(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteCategory(@PathVariable("id") UUID id) {
        categoryService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete category successfully")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CategoryResponse> getCategoryById(@PathVariable("id") UUID id) {
        return ApiResponse.<CategoryResponse>builder()
                .message("Get category successfully")
                .result(categoryService.getById(id))
                .build();
    }

    @GetMapping
    ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Get all categories successfully")
                .result(categoryService.getAll())
                .build();
    }
}
