package com.aymanetech.event.user.application.dto.request;

import com.aymanetech.event.common.application.validation.UniqueField;
import com.aymanetech.event.user.domain.entity.Permission;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

/**
 * Request DTO for {@link Permission}
 */
public record PermissionRequestDto(
        @NotBlank @UniqueField(fieldName = "name", entityClass = Permission.class, message = "Permission name already exists")
        String name
) implements Serializable {
}