const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration for Supabase
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory with proper headers
app.use(express.static('public', {
    maxAge: '1d',
    etag: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Serve index.html for all routes (SPA fallback)
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(__dirname + '/public/index.html');
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Supabase database connected successfully');
    }
});

// API Routes

// GET /api/talents - Get all talents
app.get('/api/talents', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM talents ORDER BY submission_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching talents:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/talents/:id - Get single talent by ID
app.get('/api/talents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM talents WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Talent not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching talent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/talents - Create new talent application
app.post('/api/talents', async (req, res) => {
    try {
        const {
            full_name, student_id, phone_number, email, department, year_of_study,
            talent_type, performance_title, performance_duration, required_equipment,
            accompaniment_needed, accompaniment_details, emergency_contact_name,
            emergency_contact_phone, special_requirements, previous_experience,
            availability_notes
        } = req.body;

        // Validation
        if (!full_name || !student_id || !phone_number || !department || !year_of_study || 
            !talent_type || !performance_title || !performance_duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await pool.query(
            `INSERT INTO talents (
                full_name, student_id, phone_number, email, department, year_of_study,
                talent_type, performance_title, performance_duration, required_equipment,
                accompaniment_needed, accompaniment_details, emergency_contact_name,
                emergency_contact_phone, special_requirements, previous_experience,
                availability_notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [
                full_name, student_id, phone_number, email, department, year_of_study,
                talent_type, performance_title, performance_duration, required_equipment,
                accompaniment_needed, accompaniment_details, emergency_contact_name,
                emergency_contact_phone, special_requirements, previous_experience,
                availability_notes
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating talent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/talents/:id - Update talent status
app.put('/api/talents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            'UPDATE talents SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Talent not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating talent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/talents/:id - Delete talent application
app.delete('/api/talents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM talents WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Talent not found' });
        }

        res.json({ message: 'Talent application deleted successfully' });
    } catch (err) {
        console.error('Error deleting talent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/stats - Get summary statistics
app.get('/api/stats', async (req, res) => {
    try {
        const talentResult = await pool.query('SELECT * FROM talent_summary');
        const deptResult = await pool.query('SELECT * FROM department_summary');
        
        res.json({
            by_talent_type: talentResult.rows,
            by_department: deptResult.rows
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;