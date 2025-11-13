package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.account.AccountCreationRequest;
import org.camphub.be_camphub.dto.request.account.AccountPatchRequest;
import org.camphub.be_camphub.dto.request.account.AccountUpdateRequest;
import org.camphub.be_camphub.dto.response.account.AccountResponse;
import org.camphub.be_camphub.entity.Account;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "trustScore", constant = "100")
    @Mapping(target = "coinBalance", constant = "0.0")
    @Mapping(target = "userType", expression = "java(org.camphub.be_camphub.enums.UserType.USER)")
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Account creationRequestToEntity(AccountCreationRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    void updateRequestToEntity(@MappingTarget Account account, AccountUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    void patchRequestToEntity(@MappingTarget Account account, AccountPatchRequest request);

    AccountResponse entityToResponse(Account account);
}

