CREATE TYPE booking_type AS ENUM ('AUTOMATIC', 'MANUAL');

CREATE TABLE events
(
    id              BIGSERIAL PRIMARY KEY NOT NULL,
    title           VARCHAR(255)          NOT NULL,
    slug            VARCHAR(255)          NOT NULL,
    description     TEXT                  NOT NULL,
    number_of_seats INTEGER               NOT NULL,
    price           DECIMAL               NOT NULL,
    date            TIMESTAMP             NOT NULL,
    location        VARCHAR(255)          NOT NULL,
    is_verified     BOOL                  NOT NULL,
    booking_type    booking_type          NOT NULL,
    category_id     BIGSERIAL             NOT NULL,
    organizer_id    BIGSERIAL             NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
    CONSTRAINT fk_event_organizer FOREIGN KEY (organizer_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE SEQUENCE events_seq
    START WITH 1
    INCREMENT BY 50
    MINVALUE 1
    MAXVALUE 999999999
    NO CYCLE CACHE 20;
