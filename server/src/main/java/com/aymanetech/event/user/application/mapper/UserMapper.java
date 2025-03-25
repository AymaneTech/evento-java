package com.aymanetech.event.user.application.mapper;

import com.aymanetech.event.common.application.mapper.BaseMapper;
import com.aymanetech.event.user.application.dto.request.RegisterNewUserRequestDto;
import com.aymanetech.event.user.application.dto.request.UpdateUserRequestDto;
import com.aymanetech.event.user.application.dto.response.UserResponseDto;
import com.aymanetech.event.user.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = BaseMapper.class)
public interface UserMapper {

    @Mapping(source = "firstName", target = "name.firstName")
    @Mapping(source = "lastName", target = "name.lastName")
    User toEntity(RegisterNewUserRequestDto dto);

    @Mapping(target = "firstName", source = "name.firstName")
    @Mapping(target = "lastName", source = "name.lastName")
    @Mapping(target = "id", source = "id.value")
    UserResponseDto toResponseDto(User user);

    void updateEntity(@MappingTarget User entity, UpdateUserRequestDto request);
}
