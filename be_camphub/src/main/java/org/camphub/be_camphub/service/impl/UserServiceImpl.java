package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.camphub.be_camphub.Utils.SecurityUtils;
import org.camphub.be_camphub.dto.request.user.UserCreationRequest;
import org.camphub.be_camphub.dto.request.user.UserPatchRequest;
import org.camphub.be_camphub.dto.request.user.UserUpdateRequest;
import org.camphub.be_camphub.dto.response.user.UserResponse;
import org.camphub.be_camphub.entity.User;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.UserMapper;
import org.camphub.be_camphub.repository.UserRepository;
import org.camphub.be_camphub.service.UserService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    SecurityUtils securityUtils;

    @Override
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::entityToResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(String id) {
        return userMapper.entityToResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        User user = userMapper.creationRequestToEntity(request);

        user.setPassword(securityUtils.encryptPassword(request.getPassword()));
        return userMapper.entityToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateRequestToEntity(user, request);
        return userMapper.entityToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse patchUser(String id, UserPatchRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.patchRequestToEntity(user, request);
        return userMapper.entityToResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public UserResponse getMyInfo() {
        return null;
    }
}
