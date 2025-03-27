package com.aymanetech.event.user.infrastructure.web;

import com.aymanetech.event.user.application.dto.request.ChangePasswordRequestDto;
import com.aymanetech.event.user.application.dto.request.RegisterNewUserRequestDto;
import com.aymanetech.event.user.application.dto.request.UpdateUserRequestDto;
import com.aymanetech.event.user.application.dto.request.UserLoginRequestDto;
import com.aymanetech.event.user.application.dto.response.AuthenticationResponseDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;
import com.aymanetech.event.user.application.service.AuthenticationService;
import com.aymanetech.event.user.application.service.UserService;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.vo.UserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/register")
    ResponseEntity<UserResponseDto> registerUser(@RequestBody @Valid RegisterNewUserRequestDto dto) {
        var user = authenticationService.registerNewUser(dto);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    ResponseEntity<AuthenticationResponseDto> login(@RequestBody @Valid UserLoginRequestDto dto) {
        var user = authenticationService.login(dto);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    ResponseEntity<Void> changePassword(@RequestBody @Valid ChangePasswordRequestDto request) {
        authenticationService.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    ResponseEntity<UserResponseDto> me() {
        var authenticateduser = authenticationService.getAuthenticatedUser();
        return ResponseEntity.ok(authenticateduser);
    }

    @PutMapping
    ResponseEntity<UserResponseDto> updateProfile(@RequestBody @Valid UpdateUserRequestDto request) {
        var userId = getPrincipalId();
        var user = userService.updateUser(userId, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping
    ResponseEntity<Void> deleteAccount() {
        userService.deleteUser(getPrincipalId());
        return ResponseEntity.notFound().build();
    }

    private UserId getPrincipalId() {
        return ((User) getContext().getAuthentication().getPrincipal())
                .getId();
    }
}
