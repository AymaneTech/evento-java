package com.aymanetech.event.event.application.dto.nested;

import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.user.application.dto.nested.NestedUser;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record NestedEvent(@NotNull Long id,
                          @NotBlank String title,
                          @NotBlank String slug,
                          @NotBlank String description,
                          @NotNull Integer numberOfSeats,
                          @NotNull BigDecimal price,
                          @NotNull LocalDateTime date,
                          @NotBlank String location,
                          BookingType bookingType,
                          @NotNull NestedCategory category,
                          @NotNull NestedUser user) {
}
