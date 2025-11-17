export interface DamageTypeCreationRequest {
    name: string;
    description: string;
    compensationRate: number;
}

export interface DamageTypePatchRequest {
    name?: string;
    description?: string;
    compensationRate?: number;
}

export interface DamageTypeUpdateRequest {
    name: string;
    description: string;
    compensationRate: number;
}