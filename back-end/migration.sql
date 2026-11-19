CREATE TABLE
    missions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        datetime TIMESTAMPTZ NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

CREATE TYPE user_role AS ENUM ('particular', 'student', 'admin');

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        email_verified_at TIMESTAMPTZ,
        password_hash VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'particular',
        phone VARCHAR(13),
        phone_verified_at TIMESTAMPTZ,
        avatar_key TEXT,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(10) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

alter table missions
add column author_id INTEGER NOT NULL REFERENCES users (id) ON DELETE RESTRICT;

CREATE TABLE
    student_profiles (
        user_id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        bio TEXT,
        university VARCHAR(255),
        study_field VARCHAR(255),
        study_level VARCHAR(100),
        has_driving_license BOOLEAN DEFAULT FALSE,
        has_vehicle BOOLEAN DEFAULT FALSE,
        travel_radius_km INTEGER DEFAULT 10 CHECK (travel_radius_km >= 0),
        hourly_rate DECIMAL(10, 2) CHECK (hourly_rate >= 0),
        experience TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        student_verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );

CREATE TABLE
    student_availabilities (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES student_profiles (user_id) ON DELETE CASCADE,
        day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        CHECK (end_time > start_time)
    );

CREATE TABLE
    skills (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);

CREATE TABLE
    student_skills (
        student_id INTEGER NOT NULL REFERENCES student_profiles (user_id) ON DELETE CASCADE,
        skill_id INTEGER NOT NULL REFERENCES skills (id),
        PRIMARY KEY (student_id, skill_id)
    );

CREATE TABLE
    reviews (
        id SERIAL PRIMARY KEY,
        mission_id INTEGER NOT NULL REFERENCES missions (id),
        reviewer_id INTEGER NOT NULL REFERENCES users (id),
        reviewed_id INTEGER NOT NULL REFERENCES users (id),
        rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        CHECK (reviewer_id <> reviewed_id),
        UNIQUE (mission_id, reviewer_id, reviewed_id)
    );