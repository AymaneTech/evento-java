package com.aymanetech.event.booking.application.service;

import com.aymanetech.event.booking.application.dto.BookingRequestDto;
import com.aymanetech.event.booking.application.dto.BookingResponseDto;
import com.aymanetech.event.booking.domain.BookingId;
import com.aymanetech.event.booking.domain.BookingStatus;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);

    BookingResponseDto findBookingById(BookingId id);

    Page<BookingResponseDto> findBookingsByUser(UserId userId, Pageable pageable);

    Page<BookingResponseDto> findBookingsByEvent(EventId eventId, Pageable pageable);

    BookingResponseDto updateBookingStatus(BookingId bookingId, BookingStatus status);

    void cancelBooking(BookingId bookingId);

}
