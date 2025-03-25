package com.aymanetech.event.booking.application.dto;

import com.aymanetech.event.common.application.validation.ReferenceExists;
import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.vo.EventId;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BookingRequestDto(
        @NotNull
        @ReferenceExists(entityClass = Event.class, idClass = EventId.class, message = "Event does not exist")
        Long eventId,

        @NotNull
//    @ReferenceExists(entityClass = User.class, idClass = UserId.class, message = "User does not exist")
        Integer userId,

        @NotNull
        @Min(1)
        Integer numberOfTickets
) {
}
