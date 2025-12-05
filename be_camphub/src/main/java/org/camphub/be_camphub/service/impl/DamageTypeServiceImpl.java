package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.damage_type.DamageTypeCreationRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypePatchRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypeUpdateRequest;
import org.camphub.be_camphub.dto.response.damage_type.DamageTypeResponse;
import org.camphub.be_camphub.entity.DamageType;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.DamageTypeMapper;
import org.camphub.be_camphub.repository.DamageTypeRepository;
import org.camphub.be_camphub.repository.DisputeRepository;
import org.camphub.be_camphub.service.DamageTypeService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DamageTypeServiceImpl implements DamageTypeService {
    DamageTypeRepository damageTypeRepository;
    DisputeRepository disputeRepository;
    DamageTypeMapper damageTypeMapper;

    @Override
    public DamageTypeResponse create(DamageTypeCreationRequest request) {
        if (damageTypeRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.DAMAGE_TYPE_NAME_EXISTED);
        }
        DamageType entity = damageTypeMapper.creationRequestToEntity(request);
        damageTypeRepository.save(entity);
        return damageTypeMapper.entityToResponse(entity);
    }

    @Override
    public DamageTypeResponse update(UUID id, DamageTypeUpdateRequest request) {
        DamageType entity =
                damageTypeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.DAMAGE_TYPE_NOT_FOUND));

        // Kiểm tra xem damageType đã được dùng trong dispute chưa
        if (disputeRepository.existsByDamageTypeId(id)) {
            throw new AppException(ErrorCode.DAMAGE_TYPE_IN_USE);
        }

        damageTypeMapper.updateRequestToEntity(entity, request);
        entity.setUpdatedAt(LocalDateTime.now());
        damageTypeRepository.save(entity);

        return damageTypeMapper.entityToResponse(entity);
    }

    @Override
    public DamageTypeResponse patch(UUID id, DamageTypePatchRequest request) {
        DamageType entity =
                damageTypeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.DAMAGE_TYPE_NOT_FOUND));

        // Kiểm tra xem damageType đã được dùng trong dispute chưa
        if (disputeRepository.existsByDamageTypeId(id)) {
            throw new AppException(ErrorCode.DAMAGE_TYPE_IN_USE);
        }

        damageTypeMapper.patchRequestToEntity(entity, request);
        entity.setUpdatedAt(LocalDateTime.now());
        damageTypeRepository.save(entity);

        return damageTypeMapper.entityToResponse(entity);
    }

    @Override
    public void delete(UUID id) {
        DamageType entity =
                damageTypeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.DAMAGE_TYPE_NOT_FOUND));

        // Kiểm tra xem damageType đã được dùng trong dispute chưa
        if (disputeRepository.existsByDamageTypeId(id)) {
            throw new AppException(ErrorCode.DAMAGE_TYPE_IN_USE);
        }

        // Soft delete
        entity.setIsDeleted(true);
        entity.setUpdatedAt(LocalDateTime.now());
        damageTypeRepository.save(entity);
    }

    @Override
    public DamageTypeResponse getById(UUID id) {
        DamageType entity =
                damageTypeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.DAMAGE_TYPE_NOT_FOUND));

        return damageTypeMapper.entityToResponse(entity);
    }

    @Override
    public List<DamageTypeResponse> getAll() {
        // Chỉ lấy các damage type chưa bị xóa (isDeleted = false)
        return damageTypeRepository.findByIsDeletedFalse().stream()
                .map(damageTypeMapper::entityToResponse)
                .toList();
    }
}
