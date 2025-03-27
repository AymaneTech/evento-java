package com.aymanetech.event.booking.application.mapper;

import com.aymanetech.event.booking.application.dto.BookingRequestDto;
import com.aymanetech.event.booking.application.dto.BookingResponseDto;
import com.aymanetech.event.booking.domain.Booking;
import com.aymanetech.event.common.application.mapper.BaseMapper;
import org.mapstruct.Mapper;

@Mapper(config = BaseMapper.class)
public interface BookingMapper extends BaseMapper<Booking, BookingRequestDto, BookingResponseDto> {

}
