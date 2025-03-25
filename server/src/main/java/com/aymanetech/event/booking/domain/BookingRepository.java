package com.aymanetech.event.booking.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, BookingId> {
}
