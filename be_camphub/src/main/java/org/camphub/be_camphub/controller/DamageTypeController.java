package org.camphub.be_camphub.controller;

import java.util.List;

import org.camphub.be_camphub.dto.request.damage_type.DamageTypeCreationRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypePatchRequest;
import org.camphub.be_camphub.dto.request.damage_type.DamageTypeUpdateRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.damage_type.DamageTypeResponse;
import org.camphub.be_camphub.service.DamageTypeService;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/damage-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DamageTypeController {
    DamageTypeService damageTypeService;

    @PostMapping
    ApiResponse<DamageTypeResponse> createDamageType(@RequestBody DamageTypeCreationRequest request) {
        return ApiResponse.<DamageTypeResponse>builder()
                .message("Create damage type successfully")
                .result(damageTypeService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<DamageTypeResponse> updateDamageType(
            @PathVariable("id") java.util.UUID id, @RequestBody DamageTypeUpdateRequest request) {
        return ApiResponse.<DamageTypeResponse>builder()
                .message("Update damage type successfully")
                .result(damageTypeService.update(id, request))
                .build();
    }

    @PatchMapping("/{id}")
    ApiResponse<DamageTypeResponse> patchDamageType(
            @PathVariable("id") java.util.UUID id, @RequestBody DamageTypePatchRequest request) {
        return ApiResponse.<DamageTypeResponse>builder()
                .message("Patch damage type successfully")
                .result(damageTypeService.patch(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteDamageType(@PathVariable("id") java.util.UUID id) {
        damageTypeService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete damage type successfully")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<DamageTypeResponse> getDamageTypeById(@PathVariable("id") java.util.UUID id) {
        return ApiResponse.<DamageTypeResponse>builder()
                .message("Get damage type successfully")
                .result(damageTypeService.getById(id))
                .build();
    }

    @GetMapping
    ApiResponse<List<DamageTypeResponse>> getAllDamageTypes() {
        return ApiResponse.<List<DamageTypeResponse>>builder()
                .message("Get all damage types successfully")
                .result(damageTypeService.getAll())
                .build();
    }
}
