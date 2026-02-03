# RP Musanze College - Talent Show Registration System

A comprehensive web application for collecting and managing talent show applications at RP Musanze College. Built with Node.js, Express, PostgreSQL, HTML, CSS, and JavaScript.

## Features

- **Student Registration Form**: Complete form for students to register their talent show applications
- **Admin Dashboard**: View, approve, reject, and manage applications
- **Statistics**: View application statistics by talent type and department
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Blue Theme**: Professional blue color scheme as requested

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Font**: Google Fonts (Inter)

## System Requirements

- Node.js (version 14 or higher)
- PostgreSQL database server
- Web browser (modern)

## Installation and Setup

### 1. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create Database**:
   ```sql
   CREATE DATABASE talent_show;
   ```
3. **Run Database Schema**:
   ```bash
   psql -U postgres -d talent_show -f database.sql
   ```

### 2. Application Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Database Connection**:
   Edit `server.js` and update the database configuration:
   ```javascript
   const pool = new Pool({
       user: 'postgres',
       host: 'localhost',
       database: 'talent_show',
       password: 'numugisha', // Your password
       port: 5432,
   });
   ```

3. **Start the Server**:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`

## Database Schema

The system uses a single `talents` table with the following fields:

- `id` - Auto-incrementing primary key
- `full_name` - Student's full name
- `student_id` - Student identification number
- `phone_number` - Contact phone number
- `email` - Email address (optional)
- `department` - Academic department
- `year_of_study` - Current year of study
- `talent_type` - Type of talent (singing, dancing, etc.)
- `performance_title` - Title of the performance
- `performance_duration` - Duration in minutes
- `required_equipment` - Equipment needed
- `accompaniment_needed` - Boolean for accompaniment
- `accompaniment_details` - Details about accompaniment
- `emergency_contact_name` - Emergency contact name
- `emergency_contact_phone` - Emergency contact phone
- `special_requirements` - Any special needs
- `previous_experience` - Previous performance experience
- `availability_notes` - Availability for rehearsals
- `submission_date` - Timestamp of submission
- `status` - Application status (pending, approved, rejected)

## API Endpoints

### Talent Applications

- `GET /api/talents` - Get all applications
- `GET /api/talents/:id` - Get single application
- `POST /api/talents` - Create new application
- `PUT /api/talents/:id` - Update application status
- `DELETE /api/talents/:id` - Delete application

### Statistics

- `GET /api/stats` - Get application statistics

## Usage Instructions

### For Students

1. Navigate to the application in your browser
2. Fill out the registration form with your information
3. Submit the form
4. You will receive a confirmation message with your application ID

### For Administrators

1. **View Applications**: Click "View Applications" to see all submissions
2. **Manage Applications**: Approve, reject, or delete applications from the dashboard
3. **View Statistics**: Click "View Statistics" to see application breakdowns by talent type and department

## Form Fields

### Required Fields
- Full Name
- Student ID
- Phone Number
- Department
- Year of Study
- Talent Type
- Performance Title
- Performance Duration

### Optional Fields
- Email Address
- Required Equipment
- Accompaniment Details
- Emergency Contact Information
- Special Requirements
- Previous Experience
- Availability Notes

## Security Features

- Input validation on both frontend and backend
- SQL injection protection through parameterized queries
- CORS enabled for cross-origin requests
- Form validation with HTML5 and JavaScript

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check PostgreSQL server is running
   - Verify database credentials in `server.js`
   - Ensure database `talent_show` exists

2. **Port Already in Use**:
   - Change port in `server.js` (line: `const port = process.env.PORT || 3000;`)
   - Or stop other applications using port 3000

3. **CORS Issues**:
   - CORS is already configured in the application
   - If using a different frontend, update CORS settings in `server.js`

### Development

- Use `npm run dev` for development with auto-restart
- Use `npm start` for production

## Future Enhancements

- User authentication and authorization
- File upload for performance videos/audio
- Email notifications
- PDF export of applications
- Advanced search and filtering
- Performance scheduling system

## License

This project is open source and available under the MIT License.

## Support

For technical support or questions about the application:
- Check the browser console for JavaScript errors
- Check the server console for backend errors
- Verify database connectivity
- Ensure all required fields are filled out correctly

## Contact

For questions about the talent show or application process, please contact the RP Musanze College administration office.