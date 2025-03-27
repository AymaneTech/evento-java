package com.aymanetech.event.event.application.mapper;

import com.aymanetech.event.common.application.mapper.BaseMapper;
import com.aymanetech.event.event.application.dto.request.EventRequestDto;
import com.aymanetech.event.event.application.dto.response.EventResponseDto;
import com.aymanetech.event.event.domain.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(config = BaseMapper.class)
public interface EventMapper extends BaseMapper<Event, EventRequestDto, EventResponseDto> {

    @Override
    @Mapping(target = "organiser.id", source = "organiser.id")
    @Mapping(target = "organiser.firstName", source = "organiser.name.firstName")
    @Mapping(target = "organiser.lastName", source = "organiser.name.lastName")
    EventResponseDto toResponseDto(Event entity);
}
