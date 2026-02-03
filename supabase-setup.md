# Supabase Setup Guide

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project:
   - Project name: `talent-show`
   - Database password: Set a strong password
   - Region: Choose closest to your users (e.g., `Southeast Asia (Singapore)`)

## Step 2: Set up Database
1. Wait for project creation (2-5 minutes)
2. Go to SQL Editor → New query
3. Run the following SQL to create your database schema:

```sql
-- Talent Show Database Schema for Supabase
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
    performance_duration INTEGER NOT NULL,
    required_equipment TEXT,
    accompaniment_needed BOOLEAN DEFAULT FALSE,
    accompaniment_details TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    special_requirements TEXT,
    previous_experience TEXT,
    availability_notes TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_talents_department ON talents(department);
CREATE INDEX IF NOT EXISTS idx_talents_talent_type ON talents(talent_type);
CREATE INDEX IF NOT EXISTS idx_talents_status ON talents(status);

-- Create views for statistics
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
```

## Step 3: Get Database Connection Details
1. Go to Settings → Database
2. Copy your connection string (it will look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.supabase.co:5432/postgres
   ```

## Step 4: Configure Environment Variables
You'll need these values for your Vercel deployment:
- **Database URL**: The connection string from Step 3
- **Project URL**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- **API Key**: Found in Settings → API