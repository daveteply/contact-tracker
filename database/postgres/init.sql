CREATE DATABASE contact_tracker_db;

\c contact_tracker_db;

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts
    (first_name, last_name, title, email, phone_number) 
VALUES 
    ('John', 'Doe', 'Recruiter of Jobs', 'jdoe@not.com', '555-1234')

CREATE INDEX idx_email ON contacts(email);