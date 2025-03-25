package com.aymanetech.event.booking.domain;

import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.vo.UserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookingRepository extends JpaRepository<Booking, BookingId> {

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId")
    Page<Booking> findByUserId(UserId userId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.event.id = :eventId")
    Page<Booking> findByEventId(EventId eventId, Pageable pageable);

    long countByEventAndStatus(Event event, BookingStatus status);

}
