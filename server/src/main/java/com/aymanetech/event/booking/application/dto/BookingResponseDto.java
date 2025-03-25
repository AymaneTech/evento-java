package com.aymanetech.event.booking.application.dto;

import com.aymanetech.event.booking.domain.BookingStatus;
import com.aymanetech.event.event.application.dto.nested.NestedEvent;
import com.aymanetech.event.user.application.dto.nested.NestedUser;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponseDto(
        Long id,
        NestedEvent event,
        NestedUser user,
        BookingStatus status,
        Integer numberOfTickets,
        BigDecimal totalPrice,
        LocalDateTime bookingDate
) {
}