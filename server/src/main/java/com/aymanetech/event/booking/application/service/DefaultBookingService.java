package com.aymanetech.event.booking.application.service;

import com.aymanetech.event.booking.application.dto.BookingRequestDto;
import com.aymanetech.event.booking.application.dto.BookingResponseDto;
import com.aymanetech.event.booking.application.mapper.BookingMapper;
import com.aymanetech.event.booking.domain.Booking;
import com.aymanetech.event.booking.domain.BookingId;
import com.aymanetech.event.booking.domain.BookingRepository;
import com.aymanetech.event.booking.domain.BookingStatus;
import com.aymanetech.event.common.application.service.ApplicationService;
import com.aymanetech.event.common.exception.ResourceNotFoundException;
import com.aymanetech.event.event.application.service.EventService;
import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@ApplicationService
@RequiredArgsConstructor
public class DefaultBookingService implements BookingService {
    private final BookingRepository repository;
    private final BookingMapper mapper;
    private final EventService eventService;

    @Override
    public BookingResponseDto createBooking(BookingRequestDto request) {
        var event = eventService.findEventEntityById(EventId.of(request.eventId()));

        ensureSeatsAreAvailable(request, event);
        var booking = mapper.toEntity(request)
                .setStatus(event.getBookingType() == BookingType.AUTOMATIC ?
                        BookingStatus.APPROVED : BookingStatus.PENDING);

        var savedBooking = repository.save(booking);
        return mapper.toResponseDto(savedBooking);
    }

    private void ensureSeatsAreAvailable(BookingRequestDto request, Event event) {
        long approvedBookings = repository.countByEventAndStatus(event, BookingStatus.APPROVED);
        if (approvedBookings + request.numberOfTickets() > event.getNumberOfSeats())
            throw new IllegalStateException("Not enough seats available");
    }

    @Override
    public BookingResponseDto findBookingById(BookingId id) {
        return repository.findById(id)
                .map(mapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id.value()));
    }

    @Override
    public Page<BookingResponseDto> findBookingsByUser(UserId userId, Pageable pageable) {
        return repository.findByUserId(userId, pageable)
                .map(mapper::toResponseDto);
    }

    @Override
    public Page<BookingResponseDto> findBookingsByEvent(EventId eventId, Pageable pageable) {
        return repository.findByEventId(eventId, pageable)
                .map(mapper::toResponseDto);
    }

    @Override
    public BookingResponseDto updateBookingStatus(BookingId bookingId, BookingStatus status) {
        var booking = getBookingById(bookingId);
        booking.setStatus(status);
        return mapper.toResponseDto(booking);
    }

    private Booking getBookingById(BookingId bookingId) {
        return repository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId.value()));
    }

    @Override
    public void cancelBooking(BookingId bookingId) {
        getBookingById(bookingId)
                .setStatus(BookingStatus.CANCELLED);
    }
}
