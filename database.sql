-- Talent Show Database Schema
-- This script creates the database structure for the talent show form system

-- Create database (run this separately if needed)
-- CREATE DATABASE talent_show;

-- Create talents table
CREATE TABLE IF NOT EXISTS talents (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(100) NOT NULL,
    year_of_study INTEGER NOT NULL,
    talent_type VARCHAR(50) NOT NULL,
    performance_title VARCHAR(200) NOT NULL,
    performance_duration INTEGER NOT NULL, -- in minutes
    required_equipment TEXT,
    accompaniment_needed BOOLEAN DEFAULT FALSE,
    accompaniment_details TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    special_requirements TEXT,
    previous_experience TEXT,
    availability_notes TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' -- pending, approved, rejected
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_talents_department ON talents(department);
CREATE INDEX IF NOT EXISTS idx_talents_talent_type ON talents(talent_type);
CREATE INDEX IF NOT EXISTS idx_talents_status ON talents(status);

-- Insert sample data for testing
INSERT INTO talents (
    full_name, student_id, phone_number, email, department, year_of_study,
    talent_type, performance_title, performance_duration, required_equipment,
    accompaniment_needed, accompaniment_details, emergency_contact_name,
    emergency_contact_phone, special_requirements, previous_experience,
    availability_notes, status
) VALUES (
    'Sample Talent',
    'STD001',
    '+250788000000',
    'sample@rp.ac.rw',
    'Computer Science',
    2,
    'Singing',
    'Sample Performance',
    5,
    'Microphone',
    false,
    '',
    'Sample Contact',
    '+250788000001',
    'None',
    'First time participating',
    'Available on weekends',
    'pending'
) ON CONFLICT DO NOTHING;

-- View to get summary statistics
CREATE OR REPLACE VIEW talent_summary AS
SELECT 
    talent_type,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM talents
GROUP BY talent_type
ORDER BY total_applications DESC;

-- View to get department statistics
CREATE OR REPLACE VIEW department_summary AS
SELECT 
    department,
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM talents
GROUP BY department
ORDER BY total_applications DESC;