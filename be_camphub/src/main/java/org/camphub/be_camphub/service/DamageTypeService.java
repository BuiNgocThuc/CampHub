package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.damage_type.DamageTypeCreationRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypePatchRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypeUpdateRequest;
import org.camphub.be_camphub.dto.response.damage_type.DamageTypeResponse;

public interface DamageTypeService {
    DamageTypeResponse create(DamageTypeCreationRequest request);

    DamageTypeResponse update(UUID id, DamageTypeUpdateRequest request);

    DamageTypeResponse patch(UUID id, DamageTypePatchRequest request);

    void delete(UUID id);

    DamageTypeResponse getById(UUID id);

    List<DamageTypeResponse> getAll();
}
