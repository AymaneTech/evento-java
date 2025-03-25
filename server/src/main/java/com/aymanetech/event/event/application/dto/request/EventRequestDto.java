package com.aymanetech.event.event.application.dto.request;

import com.aymanetech.event.common.application.validation.ReferenceExists;
import com.aymanetech.event.common.application.validation.UniqueField;
import com.aymanetech.event.event.domain.entity.Category;
import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.CategoryId;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventRequestDto(
        @NotBlank @UniqueField(entityClass = Event.class, fieldName = "title", message = "Event title already exists") String title,
        @NotBlank String description,
        @NotNull @Positive Integer numberOfSeats,
        @NotNull @Positive BigDecimal price,
        @NotNull LocalDateTime date,
        @NotBlank String location,
        BookingType bookingType,
        @NotNull @ReferenceExists(entityClass = Category.class, idClass = CategoryId.class, message = "Category not found") Long categoryId,
        @NotNull Integer userId,
        @NotNull MultipartFile image
) {
}
