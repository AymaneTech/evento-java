package com.aymanetech.event.event.application.service.impl;

import com.aymanetech.event.common.application.service.ApplicationService;
import com.aymanetech.event.common.application.service.SlugService;
import com.aymanetech.event.common.exception.ResourceNotFoundException;
import com.aymanetech.event.event.application.dto.request.EventRequestDto;
import com.aymanetech.event.event.application.dto.response.EventResponseDto;
import com.aymanetech.event.event.application.mapper.EventMapper;
import com.aymanetech.event.event.application.service.CategoryService;
import com.aymanetech.event.event.application.service.EventService;
import com.aymanetech.event.event.application.service.FileUploader;
import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.repository.EventRepository;
import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.CategoryId;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.application.service.OrganizerService;
import com.aymanetech.event.user.domain.vo.UserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@ApplicationService
public class DefaultEventService implements EventService {
    private final EventRepository repository;
    private final EventMapper mapper;
    private final CategoryService categoryService;
    private final OrganizerService organizerService;
    private final SlugService slugService;
    private final FileUploader fileUploader;

    public DefaultEventService(EventRepository repository, EventMapper mapper, CategoryService categoryService, OrganizerService organizerService, SlugService slugService, FileUploader fileUploader) {
        this.repository = repository;
        this.mapper = mapper;
        this.categoryService = categoryService;
        this.organizerService = organizerService;
        this.slugService = slugService;
        this.fileUploader = fileUploader;
        this.slugService.setRepository(repository);
    }

    @Override
    public Page<EventResponseDto> findAllEvents(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toResponseDto);
    }

    @Override
    public EventResponseDto findEventById(EventId id) {
        return repository.findById(id)
                .map(mapper::toResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id.value()));
    }

    @Override
    public Page<EventResponseDto> findAllEventsByOrganizerId(UserId organizerId, Pageable pageable) {
        ensureOrganizerExists(organizerId);

        return repository.findAllByOrganiserId(organizerId, pageable)
                .map(mapper::toResponseDto);
    }

    @Override
    public Page<EventResponseDto> searchEventsByTitle(String title, Pageable pageable) {
        return repository.findAllByTitle(title, pageable)
                .map(mapper::toResponseDto);
    }

    @Override
    public EventResponseDto createEvent(EventRequestDto request) {
        final var imageUrl = fileUploader.upload(request.image());
        final var event = mapper.toEntity(request);
        final var category = categoryService.findCategoryEntityById(CategoryId.of(request.categoryId()));
        final var organizer = organizerService.findOrganizerById(UserId.of(request.userId()));

        event.setOrganiser(organizer)
                .setCategory(category)
                .setImageUrl(imageUrl)
                .setSlug(slugService.generateUniqueSlug(request.title()));

        final var savedEvent = repository.save(event);
        return mapper.toResponseDto(savedEvent);
    }

    @Override
    public EventResponseDto updateEvent(EventId id, EventRequestDto request) {
        final var event = findEventEntityById(id);
        final var category = categoryService.findCategoryEntityById(CategoryId.of(request.categoryId()));
        final var organizer = organizerService.findOrganizerById(UserId.of(request.userId()));
        mapper.updateEntity(event, request);
        event.setOrganiser(organizer)
                .setCategory(category)
                .setSlug(slugService.generateUniqueSlug(request.title()));
        return mapper.toResponseDto(event);
    }

    @Override
    public void deleteEvent(EventId id) {
        if (!repository.existsById(id))
            throw new ResourceNotFoundException("Event", id.value());
        repository.deleteById(id);
    }

    @Override
    public void setReservationApprovalMode(EventId eventId, BookingType bookingType) {
        final var event = findEventEntityById(eventId);
        event.setBookingType(bookingType);
    }

    @Override
    public void toggleEventValidationStatus(EventId id) {
        final var event = findEventEntityById(id);
        event.setIsVerified(!event.getIsVerified());
    }

    @Override
    public Event findEventEntityById(EventId id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id.value()));
    }

    private void ensureOrganizerExists(UserId organizerId) {
        if (!organizerService.isOrganizerExists(organizerId))
            throw new ResourceNotFoundException("Organizer", organizerId.value());
    }
}
