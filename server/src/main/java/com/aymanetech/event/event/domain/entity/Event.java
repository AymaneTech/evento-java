package com.aymanetech.event.event.domain.entity;

import com.aymanetech.event.event.domain.vo.BookingType;
import com.aymanetech.event.event.domain.vo.EventId;
import com.aymanetech.event.user.domain.entity.User;
import com.aymanetech.event.user.domain.vo.Timestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")

@Getter
@Setter
@NoArgsConstructor
public class Event {

    @EmbeddedId
    private EventId id;

    private String title;

    private String slug;

    private String description;

    private Integer numberOfSeats;

    private BigDecimal price;

    private LocalDateTime date;

    private String location;

    private Boolean isVerified = false;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private BookingType bookingType;

    @ManyToOne
    private Category category;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organiser;

    @Embedded
    private Timestamp timestamp;
}
