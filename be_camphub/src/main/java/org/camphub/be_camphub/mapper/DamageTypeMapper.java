package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.damage_type.DamageTypeCreationRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypePatchRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypeUpdateRequest;
import org.camphub.be_camphub.dto.response.damage_type.DamageTypeResponse;
import org.camphub.be_camphub.entity.DamageType;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DamageTypeMapper {

    DamageType creationRequestToEntity(DamageTypeCreationRequest request);

    void updateRequestToEntity(@MappingTarget DamageType damageType, DamageTypeUpdateRequest request);

    void patchRequestToEntity(@MappingTarget DamageType damageType, DamageTypePatchRequest request);

    DamageTypeResponse entityToResponse(DamageType damageType);
}
