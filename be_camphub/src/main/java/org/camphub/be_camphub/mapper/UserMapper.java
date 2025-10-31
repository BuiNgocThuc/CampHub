package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.user.UserCreationRequest;
import org.camphub.be_camphub.dto.request.user.UserPatchRequest;
import org.camphub.be_camphub.dto.request.user.UserUpdateRequest;
import org.camphub.be_camphub.dto.response.user.UserResponse;
import org.camphub.be_camphub.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trust_score", ignore = true)
    @Mapping(target = "CampHub_coin", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User creationRequestToEntity(UserCreationRequest request);

    void updateRequestToEntity(@MappingTarget User user, UserUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchRequestToEntity(@MappingTarget User user, UserPatchRequest request);

    UserResponse entityToResponse(User user);
}
