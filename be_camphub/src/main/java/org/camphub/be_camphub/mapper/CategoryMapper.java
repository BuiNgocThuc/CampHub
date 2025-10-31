package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.category.CategoryCreationRequest;
import org.camphub.be_camphub.dto.request.category.CategoryPatchRequest;
import org.camphub.be_camphub.dto.request.category.CategoryUpdateRequest;
import org.camphub.be_camphub.dto.response.category.CategoryResponse;
import org.camphub.be_camphub.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category creationRequestToEntity(CategoryCreationRequest request);

    void updateRequestToEntity(@MappingTarget Category category, CategoryUpdateRequest request);

    void patchRequestToEntity(@MappingTarget Category category, CategoryPatchRequest request);

    CategoryResponse entityToResponse(Category category);
}
