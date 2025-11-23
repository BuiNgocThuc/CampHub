import { createMap, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { Category } from "../types";
import { CategoryCreationRequest, CategoryPatchRequest, CategoryUpdateRequest } from "../dto/request";
import { CategoryResponse } from "../dto/response";

export const categoryMapper = createMapper({
    strategyInitializer: pojos(),
})

// declare metadata if needed in future
PojosMetadataMap.create<Category>("Category", {});
PojosMetadataMap.create<CategoryCreationRequest>("CategoryCreationRequest", {});
PojosMetadataMap.create<CategoryUpdateRequest>("CategoryUpdateRequest", {});
PojosMetadataMap.create<CategoryPatchRequest>("CategoryPatchRequest", {});
PojosMetadataMap.create<CategoryResponse>("CategoryResponse", {});

// Mapping DTO response to Model
createMap<CategoryResponse, Category>(
    categoryMapper,
    "CategoryResponse",
    "Category"
);

// Mapping Model to Creation Request DTO
createMap<Category, CategoryCreationRequest>(
    categoryMapper,
    "Category",
    "CategoryCreationRequest"
);

// Mapping Model to Update Request DTO
createMap<Category, CategoryUpdateRequest>(
    categoryMapper,
    "Category",
    "CategoryUpdateRequest"
);

// Mapping Model to Patch Request DTO
createMap<Category, CategoryPatchRequest>(
    categoryMapper,
    "Category",
    "CategoryPatchRequest"
);

// export API
export const categoryMap = {
    fromResponse: (response: CategoryResponse): Category =>
        categoryMapper.map<CategoryResponse, Category>(
            response,
            "CategoryResponse",
            "Category"
        ),
    toCreationRequest: (model: Category): CategoryCreationRequest =>
        categoryMapper.map<Category, CategoryCreationRequest>(
            model,
            "Category",
            "CategoryCreationRequest"
        ),
    toUpdateRequest: (model: Category): CategoryUpdateRequest =>
        categoryMapper.map<Category, CategoryUpdateRequest>(
            model,
            "Category",
            "CategoryUpdateRequest"
        ),
    toPatchRequest: (model: Category): CategoryPatchRequest =>
        categoryMapper.map<Category, CategoryPatchRequest>(
            model,
            "Category",
            "CategoryPatchRequest"
        ),
};
