package com.aymanetech.event.user.application.service;

import com.aymanetech.event.user.application.dto.request.RegisterNewUserRequestDto;
import com.aymanetech.event.user.application.dto.request.ChangePasswordRequestDto;
import com.aymanetech.event.user.application.dto.request.UserLoginRequestDto;
import com.aymanetech.event.user.application.dto.response.AuthenticationResponseDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;

public interface AuthenticationService {

    UserResponseDto registerNewUser(RegisterNewUserRequestDto request);

    AuthenticationResponseDto login(UserLoginRequestDto request);

    void changePassword(ChangePasswordRequestDto request);

    UserResponseDto getAuthenticatedUser();
}
