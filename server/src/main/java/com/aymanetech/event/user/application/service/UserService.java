package com.aymanetech.event.user.application.service;

import com.aymanetech.event.user.application.dto.request.UpdateUserRequestDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;
import com.aymanetech.event.user.domain.vo.UserId;

import java.util.List;

public interface UserService {
    UserResponseDto findUserById(UserId id);

    List<UserResponseDto> findAllUsers();

    UserResponseDto updateUser(UserId id, UpdateUserRequestDto request);

    void deleteUser(UserId id);
}
