package com.aymanetech.event.user.infrastructure.web;

import com.aymanetech.event.user.application.dto.request.RoleRequestDto;
import com.aymanetech.event.user.application.dto.response.RoleResponseDto;
import com.aymanetech.event.user.application.service.RoleService;
import com.aymanetech.event.user.domain.vo.RoleId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static com.aymanetech.event.common.util.UriUtil.getUri;
import static com.aymanetech.event.user.infrastructure.web.RoleController.BASE_URL;

@RestController
@RequestMapping(BASE_URL)
@RequiredArgsConstructor
public class RoleController {
    public static final String BASE_URL = "/api/v1/roles";
    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponseDto> createRole(@RequestBody @Valid RoleRequestDto dto) {
        RoleResponseDto role = roleService.createNewRole(dto);
        return ResponseEntity.created(getUri(BASE_URL, role.id()))
                .body(role);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDto> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.findRoleById(RoleId.of(id)));
    }

    @GetMapping
    public ResponseEntity<List<RoleResponseDto>> getAllRoles() {
        return ResponseEntity.ok(roleService.findAllRoles());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDto> updateRole(@PathVariable Long id, @RequestBody @Valid RoleRequestDto dto) {
        RoleResponseDto role = roleService.updateRole(RoleId.of(id), dto);
        return ResponseEntity.ok(role);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(RoleId.of(id));
        return ResponseEntity.noContent().build();
    }
}