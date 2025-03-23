package com.aymanetech.event.user.application.service.impl;

import com.aymanetech.event.common.application.service.ApplicationService;
import com.aymanetech.event.common.exception.BusinessValidationException;
import com.aymanetech.event.common.exception.ResourceNotFoundException;
import com.aymanetech.event.security.TokenService;
import com.aymanetech.event.user.application.dto.request.ChangePasswordRequestDto;
import com.aymanetech.event.user.application.dto.request.RegisterNewUserRequestDto;
import com.aymanetech.event.user.application.dto.request.UserLoginRequestDto;
import com.aymanetech.event.user.application.dto.response.AuthenticationResponseDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;
import com.aymanetech.event.user.application.mapper.UserMapper;
import com.aymanetech.event.user.application.service.AuthenticationService;
import com.aymanetech.event.user.application.service.RoleService;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.repository.UserRepository;
import com.aymanetech.event.user.domain.vo.RoleId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.aymanetech.event.user.domain.vo.UserStatus.ACTIVE;
import static com.aymanetech.event.user.domain.vo.UserStatus.PENDING;

@ApplicationService
@RequiredArgsConstructor
public class DefaultAuthenticationService implements AuthenticationService {
    private static final String DEFAULT_USER_ROLE = "ROLE_USER";

    private final UserRepository repository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final TokenService tokenService;
    private final UserMapper mapper;

    @Override
    public UserResponseDto registerNewUser(RegisterNewUserRequestDto request) {
        var role = roleService.findRoleEntityById(RoleId.of(request.roleId()));
        var status = role.getName().equals(DEFAULT_USER_ROLE) ? ACTIVE : PENDING;

        var user = mapper.toEntity(request)
                .setPassword(passwordEncoder.encode(request.password()))
                .setRole(role)
                .setStatus(status);

        var savedUser = repository.save(user);
        return mapper.toResponseDto(savedUser);
    }

    @Override
    public AuthenticationResponseDto login(UserLoginRequestDto request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var token = tokenService.generateToken(authentication);
        return new AuthenticationResponseDto(token);
    }

    @Override
    public void changePassword(ChangePasswordRequestDto request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var principal = (User) authentication.getPrincipal();

        ensureOldPasswordIsValid(request, principal);
        var newPassword = passwordEncoder.encode(request.newPassword());
        var user = getUser(principal);
        user.setPassword(newPassword);
    }

    private User getUser(User principal) {
        return repository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", principal.getId().value()));
    }

    private void ensureOldPasswordIsValid(ChangePasswordRequestDto request, User principal) {
        if (passwordEncoder.matches(request.oldPassword(), principal.getPassword()))
            throw new BusinessValidationException("Old Password is not valid");
    }
}
