package com.aymanetech.event.booking.infrastructure.web;

import com.aymanetech.event.booking.application.dto.BookingRequestDto;
import com.aymanetech.event.booking.application.dto.BookingResponseDto;
import com.aymanetech.event.booking.application.service.BookingService;
import com.aymanetech.event.booking.domain.BookingId;
import com.aymanetech.event.booking.domain.BookingStatus;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.aymanetech.event.booking.infrastructure.web.BookingController.BASE_URL;
import static com.aymanetech.event.common.util.UriUtil.getUri;

@RestController
@RequestMapping(BASE_URL)
@RequiredArgsConstructor
public class BookingController {
    public static final String BASE_URL = "/api/v1/bookings";
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody @Valid BookingRequestDto request
    ) {
        var booking = bookingService.createBooking(request);
        return ResponseEntity.created(getUri(BASE_URL, booking.id()))
                .body(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> findBookingById(
            @PathVariable Long id
    ) {
        var booking = bookingService.findBookingById(BookingId.of(id));
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BookingResponseDto>> findBookingsByUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        var bookings = bookingService.findBookingsByUser(
                UserId.of(userId),
                PageRequest.of(pageNum, pageSize)
        );
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Page<BookingResponseDto>> findBookingsByEvent(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        var bookings = bookingService.findBookingsByEvent(
                EventId.of(eventId),
                PageRequest.of(pageNum, pageSize)
        );
        return ResponseEntity.ok(bookings);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDto> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status
    ) {
        var booking = bookingService.updateBookingStatus(BookingId.of(id), status);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id
    ) {
        bookingService.cancelBooking(BookingId.of(id));
        return ResponseEntity.noContent().build();
    }
}