package com.aymanetech.event.event.application.service;

import com.aymanetech.event.event.application.dto.request.EventRequestDto;
import com.aymanetech.event.event.application.dto.response.EventResponseDto;
import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface EventService {
    Page<EventResponseDto> findAllEvents(Pageable pageable);

    EventResponseDto findEventById(EventId id);

    Page<EventResponseDto> findAllEventsByOrganizerId(UserId organizerId, Pageable pageable);

    Page<EventResponseDto> searchEventsByTitle(String title, Pageable pageable);

    EventResponseDto createEvent(EventRequestDto request);

    EventResponseDto updateEvent(EventId id, EventRequestDto request);

    Event findEventEntityById(EventId id);

    void deleteEvent(EventId id);

    void setReservationApprovalMode(EventId eventId, BookingType bookingType);

    void toggleEventValidationStatus(EventId id);


    // todo: add multi criteria filter using jpa specification
}
