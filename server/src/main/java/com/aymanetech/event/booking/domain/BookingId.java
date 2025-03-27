package com.aymanetech.event.booking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;

public record BookingId(@Column(name = "id") @GeneratedValue Long value) {
    public static BookingId of(Long value) {
        return new BookingId(value);
    }
}
