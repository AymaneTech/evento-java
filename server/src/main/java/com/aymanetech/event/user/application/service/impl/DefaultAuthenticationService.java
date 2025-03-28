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
import com.aymanetech.event.user.domain.vo.UserId;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Map;

import static com.aymanetech.event.user.domain.vo.UserStatus.ACTIVE;

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
        // var status = role.getName().equals(DEFAULT_USER_ROLE) ? ACTIVE : PENDING;
        var status = ACTIVE; // todo: if user is orgnaizer or admin make request in pending status

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
        var principal = getCurrentUser();

        ensureOldPasswordIsValid(request, principal);
        var newPassword = passwordEncoder.encode(request.newPassword());
        var user = getUser(principal);
        user.setPassword(newPassword);
    }

    @Override
    public UserResponseDto getAuthenticatedUser() {
        var principal = getCurrentUser();
        return mapper.toResponseDto(principal);
    }

    private String extractUserIdAsString(Object idClaim) {
        return switch (idClaim) {
            case Map<?, ?> mapClaim -> String.valueOf(mapClaim.get("value"));
            case String stringClaim -> stringClaim;
            case Number numberClaim -> numberClaim.toString();
            case null -> throw new IllegalArgumentException("ID claim is null");
            default -> String.valueOf(idClaim);
        };
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            var jwt = (Jwt) jwtAuthentication.getPrincipal();

            Object idClaim = jwt.getClaim("id");
            String userIdAsString = extractUserIdAsString(idClaim);

            var userId = UserId.of(Integer.valueOf(userIdAsString));

            return repository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        throw new BusinessValidationException("Not authenticated with JWT");
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
