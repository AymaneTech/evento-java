CREATE TABLE bookings
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    is_verified BOOL                  NOT NULL,
    user_id     BIGSERIAL             NOT NULL,
    event_id    BIGSERIAL             NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE SEQUENCE bookings_seq
    START WITH 1
    INCREMENT BY 50
    MINVALUE 1
    MAXVALUE 999999999
    NO CYCLE CACHE 20;
