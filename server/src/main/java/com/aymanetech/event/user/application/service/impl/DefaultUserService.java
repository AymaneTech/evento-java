package com.aymanetech.event.user.application.service.impl;

import com.aymanetech.event.common.application.service.ApplicationService;
import com.aymanetech.event.common.exception.ResourceNotFoundException;
import com.aymanetech.event.user.application.dto.request.UpdateUserRequestDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;
import com.aymanetech.event.user.application.mapper.UserMapper;
import com.aymanetech.event.user.application.service.RoleService;
import com.aymanetech.event.user.application.service.UserService;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.repository.UserRepository;
import com.aymanetech.event.user.domain.vo.RoleId;
import com.aymanetech.event.user.domain.vo.UserId;
import java.util.List;
import lombok.RequiredArgsConstructor;

@ApplicationService
@RequiredArgsConstructor
public class DefaultUserService implements UserService {

    private final UserRepository repository;
    private final RoleService roleService;
    private final UserMapper mapper;

    @Override
    public UserResponseDto findUserById(UserId id) {
        return repository
            .findById(id)
            .map(mapper::toResponseDto)
            .orElseThrow(() -> new ResourceNotFoundException("User", id.value())
            );
    }

    @Override
    public List<UserResponseDto> findAllUsers() {
        return repository
            .findAll()
            .stream()
            .map(mapper::toResponseDto)
            .toList();
    }

    @Override
    public UserResponseDto updateUser(UserId id, UpdateUserRequestDto request) {
        var user = findUserEntityById(id);
        var role = roleService.findRoleEntityById(RoleId.of(request.roleId()));

        mapper.updateEntity(user, request);
        user.setRole(role);

        var updatedUser = repository.save(user);
        return mapper.toResponseDto(updatedUser);
    }

    @Override
    public void deleteUser(UserId id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(
            "User",
            id.value()
        );
        repository.deleteById(id);
    }

    private User findUserEntityById(UserId id) {
        return repository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Role", id.value())
            );
    }
}
