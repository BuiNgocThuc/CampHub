export interface CategoryCreationRequest {
    name: string;
    description: string;
}

export interface CategoryPatchRequest {
    name?: string;
    description?: string;
}

export interface CategoryUpdateRequest {
    name: string;
    description: string;
}
