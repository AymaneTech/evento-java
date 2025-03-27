package com.aymanetech.event.user.application.dto.response;


import com.aymanetech.event.user.application.dto.nested.NestedRole;
import com.aymanetech.event.user.domain.vo.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Response DTO for {@link com.aymanetech.event.user.domain.entity.User}
 */
public record UserResponseDto(@NotNull Integer id,
                              @NotBlank String firstName,
                              @NotBlank String lastName,
                              @NotBlank String email,
                              @NotNull UserStatus status,
                              @NotNull NestedRole role
) {
}
