package com.aymanetech.event.user.application.dto.request;


import com.aymanetech.event.common.application.validation.UniqueField;
import com.aymanetech.event.user.domain.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for {@link com.aymanetech.event.user.domain.entity.User}
 */
public record RegisterNewUserRequestDto(@NotBlank String firstName,
                                        @NotBlank String lastName,
                                        @NotBlank @UniqueField(fieldName = "email", entityClass = User.class, message = "email already taken") String email,
                                        @NotBlank String password,
                                        @NotNull Long roleId
) {
}
