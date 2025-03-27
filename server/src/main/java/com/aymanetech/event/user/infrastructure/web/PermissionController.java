package com.aymanetech.event.user.infrastructure.web;

import com.aymanetech.event.user.application.dto.request.PermissionRequestDto;
import com.aymanetech.event.user.application.dto.response.PermissionResponseDto;
import com.aymanetech.event.user.application.service.PermissionService;
import com.aymanetech.event.user.domain.vo.PermissionId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static com.aymanetech.event.common.util.UriUtil.getUri;
import static com.aymanetech.event.user.infrastructure.web.PermissionController.BASE_URL;

@RestController
@RequestMapping(BASE_URL)
@RequiredArgsConstructor
public class PermissionController {
    public final static String BASE_URL = "/api/v1/permissions";
    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<PermissionResponseDto> createPermission(@RequestBody @Valid PermissionRequestDto dto) {
        PermissionResponseDto permission = permissionService.createNewPermission(dto);
        return ResponseEntity.created(getUri(BASE_URL, permission.id()))
                .body(permission);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponseDto> getPermissionById(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.findPermissionById(PermissionId.of(id)));
    }

    @GetMapping
    public ResponseEntity<List<PermissionResponseDto>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.findAllPermissions());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PermissionResponseDto> updatePermission(@PathVariable Long id, @RequestBody @Valid PermissionRequestDto dto) {
        PermissionResponseDto permission = permissionService.updatePermission(PermissionId.of(id), dto);
        return ResponseEntity.ok(permission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(PermissionId.of(id));
        return ResponseEntity.noContent().build();
    }
}