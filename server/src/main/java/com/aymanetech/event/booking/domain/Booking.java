package com.aymanetech.event.booking.domain;

import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.vo.Timestamp;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")

@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @EmbeddedId
    private BookingId id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Event event;

    private Boolean isVerified;

    @Embedded
    private Timestamp timestamp;
}
