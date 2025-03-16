package com.aymanetech.event.event.infrastructure.web;

import com.aymanetech.event.event.application.dto.request.EventRequestDto;
import com.aymanetech.event.event.application.dto.response.EventResponseDto;
import com.aymanetech.event.event.application.service.EventService;
import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.aymanetech.event.common.util.UriUtil.getUri;
import static com.aymanetech.event.event.infrastructure.web.EventController.BASE_URL;

@RestController
@RequestMapping(BASE_URL)
@RequiredArgsConstructor
public class EventController {
    public static final String BASE_URL = "/api/v1/events";
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventResponseDto>> findAllEvents(@RequestParam(defaultValue = "0") int pageNum,
                                                                @RequestParam(defaultValue = "10") int pageSize) {
        var events = eventService.findAllEvents(PageRequest.of(pageNum, pageSize));
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> findEventById(@PathVariable Long id) {
        var event = eventService.findEventById(EventId.of(id));
        return ResponseEntity.ok(event);
    }

    @GetMapping("/{organiserId}")
    public ResponseEntity<Page<EventResponseDto>> findAllEventsByOrganiserId(@PathVariable Integer organiserId,
                                                                             @RequestParam(defaultValue = "0") int pageNum,
                                                                             @RequestParam(defaultValue = "10") int pageSize) {
        var events = eventService.findAllEventsByOrganizerId(UserId.of(organiserId), PageRequest.of(pageNum, pageSize));
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{title}")
    public ResponseEntity<Page<EventResponseDto>> searchEventByTitle(@PathVariable String title,
                                                                     @RequestParam(defaultValue = "0") int pageNum,
                                                                     @RequestParam(defaultValue = "10") int pageSize) {
        var events = eventService.searchEventsByTitle(title, PageRequest.of(pageNum, pageSize));
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@RequestBody @Valid EventRequestDto request) {
        var event = eventService.createEvent(request);
        return ResponseEntity.created(getUri(BASE_URL, event.id()))
                .body(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDto> updateEvent(@PathVariable Long id, @RequestBody @Valid EventRequestDto request) {
        var event = eventService.updateEvent(EventId.of(id), request);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(EventId.of(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/{bookingType}")
    public ResponseEntity<Void> setReservationApprovalMode(@PathVariable Long id, @PathVariable BookingType bookingType) {
        eventService.setReservationApprovalMode(EventId.of(id), bookingType);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/toggle/{id}")
    public ResponseEntity<Void> toggleEventValidationStatus(@PathVariable Long id) {
        eventService.toggleEventValidationStatus(EventId.of(id));
        return ResponseEntity.noContent().build();
    }
}
