package com.aymanetech.event.booking.domain;

import com.aymanetech.event.event.domain.entity.Event;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.vo.Timestamp;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @EmbeddedId
    private BookingId id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    private Integer numberOfTickets;

    private BigDecimal totalPrice;

    @Embedded
    private Timestamp timestamp;

    public Booking setEvent(Event event) {
        this.event = event;
        this.totalPrice = event.getPrice().multiply(BigDecimal.valueOf(numberOfTickets));
        return this;
    }
}
