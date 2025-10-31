package org.camphub.be_camphub.service;

import java.util.List;

import org.camphub.be_camphub.dto.request.user.UserCreationRequest;
import org.camphub.be_camphub.dto.request.user.UserPatchRequest;
import org.camphub.be_camphub.dto.request.user.UserUpdateRequest;
import org.camphub.be_camphub.dto.response.user.UserResponse;

public interface UserService {
    List<UserResponse> getUsers();

    UserResponse getUserById(String id);

    UserResponse createUser(UserCreationRequest request);

    UserResponse updateUser(String id, UserUpdateRequest request);

    UserResponse patchUser(String id, UserPatchRequest request);

    void deleteUser(String id);

    UserResponse getMyInfo();
}
