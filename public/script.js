// Talent Show Form Application
// JavaScript functionality for the RP Musanze College Talent Show Registration

// DOM Elements
const form = document.getElementById('talentForm');
const accompanimentNeeded = document.getElementById('accompanimentNeeded');
const accompanimentDetails = document.getElementById('accompanimentDetails');
const accompanimentDetailsInput = document.getElementById('accompanimentDetailsInput');
const successMessage = document.createElement('div');
const errorMessage = document.createElement('div');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup success and error message elements
    successMessage.className = 'success-message';
    errorMessage.className = 'error-message';
    
    // Add event listeners
    accompanimentNeeded.addEventListener('change', toggleAccompanimentDetails);
    form.addEventListener('submit', handleFormSubmit);
    
    // Add validation for form fields
    setupFormValidation();
    
    console.log('Talent Show Application loaded successfully');
});

// Toggle accompaniment details section
function toggleAccompanimentDetails() {
    if (accompanimentNeeded.checked) {
        accompanimentDetails.style.display = 'block';
        accompanimentDetailsInput.required = true;
    } else {
        accompanimentDetails.style.display = 'none';
        accompanimentDetailsInput.required = false;
        accompanimentDetailsInput.value = '';
    }
}

// Setup form validation
function setupFormValidation() {
    // Phone number validation
    const phoneNumber = document.getElementById('phoneNumber');
    phoneNumber.addEventListener('input', function() {
        const value = this.value;
        // Allow only numbers and common phone number formats
        if (!/^[+]?[\d\s\-\(\)]*$/.test(value)) {
            this.setCustomValidity('Please enter a valid phone number');
        } else {
            this.setCustomValidity('');
        }
    });

    // Email validation
    const email = document.getElementById('email');
    email.addEventListener('input', function() {
        const value = this.value;
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.setCustomValidity('');
        }
    });

    // Performance duration validation
    const duration = document.getElementById('performanceDuration');
    duration.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value < 1 || value > 10) {
            this.setCustomValidity('Performance duration must be between 1 and 10 minutes');
        } else {
            this.setCustomValidity('');
        }
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check if form is valid
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Debug: Log raw form data
    console.log('Raw form data:', data);
    console.log('Form entries:', Array.from(formData.entries()));
    
    // Convert field names to match backend expectations (snake_case)
    const backendData = {
        full_name: data.fullName || '',
        student_id: data.studentId || '',
        phone_number: data.phoneNumber || '',
        email: data.email || '',
        department: data.department || '',
        year_of_study: parseInt(data.yearOfStudy) || 0,
        talent_type: data.talentType || '',
        performance_title: data.performanceTitle || '',
        performance_duration: parseInt(data.performanceDuration) || 0,
        required_equipment: data.requiredEquipment || '',
        accompaniment_needed: accompanimentNeeded.checked,
        accompaniment_details: accompanimentDetailsInput.value || '',
        emergency_contact_name: data.emergencyContactName || '',
        emergency_contact_phone: data.emergencyContactPhone || '',
        special_requirements: data.specialRequirements || '',
        previous_experience: data.previousExperience || '',
        availability_notes: data.availabilityNotes || ''
    };

    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Debug: Log what we're sending to the server
        console.log('Sending to server:', backendData);
        
        // Submit data to server
        const response = await fetch('/api/talents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData)
        });

        if (response.ok) {
            const result = await response.json();
            
            // Show success message
            showSuccessMessage('Application submitted successfully! Your application ID is: ' + result.id);
            form.reset();
            toggleAccompanimentDetails(); // Reset accompaniment section
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit application');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage('Error submitting application: ' + error.message);
        
        // Reset button
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Submit Application';
        submitBtn.disabled = false;
    }
}

// Show success message
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Insert message at the top of the form
    if (!successMessage.parentNode) {
        form.insertBefore(successMessage, form.firstChild);
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Insert message at the top of the form
    if (!errorMessage.parentNode) {
        form.insertBefore(errorMessage, form.firstChild);
    }
}

// Reset form
function resetForm() {
    form.reset();
    toggleAccompanimentDetails(); // Reset accompaniment section
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Dashboard functionality
async function showDashboard() {
    const modal = document.getElementById('dashboardModal');
    const applicationsList = document.getElementById('applicationsList');
    const totalApps = document.getElementById('totalApps');
    const approvedApps = document.getElementById('approvedApps');
    const pendingApps = document.getElementById('pendingApps');
    const rejectedApps = document.getElementById('rejectedApps');

    try {
        // Show loading
        applicationsList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading applications...</p></div>';
        modal.style.display = 'block';

        // Fetch data
        const [talentsResponse, statsResponse] = await Promise.all([
            fetch('/api/talents'),
            fetch('/api/stats')
        ]);

        if (talentsResponse.ok && statsResponse.ok) {
            const talents = await talentsResponse.json();
            const stats = await statsResponse.json();

            // Update statistics
            totalApps.textContent = talents.length;
            approvedApps.textContent = stats.by_talent_type.reduce((sum, item) => sum + item.approved, 0);
            pendingApps.textContent = stats.by_talent_type.reduce((sum, item) => sum + item.pending, 0);
            rejectedApps.textContent = stats.by_talent_type.reduce((sum, item) => sum + item.rejected, 0);

            // Render applications list
            if (talents.length === 0) {
                applicationsList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No applications yet. Be the first to apply!</p>';
            } else {
                applicationsList.innerHTML = talents.map(talent => `
                    <div class="applicant-card">
                        <div class="applicant-info">
                            <h4>${talent.full_name} <span style="color: var(--text-light); font-weight: normal;">(${talent.student_id})</span></h4>
                            <p><strong>Talent:</strong> ${talent.talent_type} | <strong>Performance:</strong> ${talent.performance_title}</p>
                            <p><strong>Department:</strong> ${talent.department} | <strong>Year:</strong> ${talent.year_of_study}</p>
                            <p><strong>Duration:</strong> ${talent.performance_duration} minutes | <strong>Submitted:</strong> ${new Date(talent.submission_date).toLocaleDateString()}</p>
                            ${talent.required_equipment ? `<p><strong>Equipment:</strong> ${talent.required_equipment}</p>` : ''}
                            ${talent.accompaniment_needed ? `<p><strong>Accompaniment:</strong> ${talent.accompaniment_details || 'Yes'}</p>` : ''}
                        </div>
                        <div class="applicant-actions">
                            <span class="status-badge status-${talent.status}">${talent.status}</span>
                            ${talent.status === 'pending' ? `
                                <button class="btn btn-approve" onclick="updateStatus(${talent.id}, 'approved')">Approve</button>
                                <button class="btn btn-reject" onclick="updateStatus(${talent.id}, 'rejected')">Reject</button>
                            ` : ''}
                            <button class="btn btn-secondary" onclick="deleteApplication(${talent.id})">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            throw new Error('Failed to load data');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        applicationsList.innerHTML = `<p style="color: var(--danger-color);">Error loading applications: ${error.message}</p>`;
    }
}

// Update application status
async function updateStatus(id, status) {
    try {
        const response = await fetch(`/api/talents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });

        if (response.ok) {
            showSuccessMessage(`Application status updated to ${status}`);
            showDashboard(); // Refresh dashboard
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showErrorMessage('Error updating status: ' + error.message);
    }
}

// Delete application
async function deleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) {
        return;
    }

    try {
        const response = await fetch(`/api/talents/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showSuccessMessage('Application deleted successfully');
            showDashboard(); // Refresh dashboard
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete application');
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        showErrorMessage('Error deleting application: ' + error.message);
    }
}

// Statistics functionality
async function showStats() {
    const modal = document.getElementById('statsModal');
    const talentTypeStats = document.getElementById('talentTypeStats');
    const departmentStats = document.getElementById('departmentStats');

    try {
        // Show loading
        talentTypeStats.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading statistics...</p></div>';
        departmentStats.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading statistics...</p></div>';
        modal.style.display = 'block';

        // Fetch statistics
        const response = await fetch('/api/stats');
        
        if (response.ok) {
            const stats = await response.json();

            // Render talent type statistics
            if (stats.by_talent_type.length === 0) {
                talentTypeStats.innerHTML = '<p style="text-align: center; color: var(--text-light);">No statistics available yet.</p>';
            } else {
                talentTypeStats.innerHTML = stats.by_talent_type.map(item => `
                    <div class="stat-item">
                        <h4>${item.talent_type}</h4>
                        <div class="value">${item.total_applications}</div>
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light);">
                            Approved: ${item.approved} | Pending: ${item.pending} | Rejected: ${item.rejected}
                        </div>
                    </div>
                `).join('');
            }

            // Render department statistics
            if (stats.by_department.length === 0) {
                departmentStats.innerHTML = '<p style="text-align: center; color: var(--text-light);">No statistics available yet.</p>';
            } else {
                departmentStats.innerHTML = stats.by_department.map(item => `
                    <div class="stat-item">
                        <h4>${item.department}</h4>
                        <div class="value">${item.total_applications}</div>
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light);">
                            Approved: ${item.approved} | Pending: ${item.pending} | Rejected: ${item.rejected}
                        </div>
                    </div>
                `).join('');
            }
        } else {
            throw new Error('Failed to load statistics');
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        talentTypeStats.innerHTML = `<p style="color: var(--danger-color);">Error loading statistics: ${error.message}</p>`;
        departmentStats.innerHTML = `<p style="color: var(--danger-color);">Error loading statistics: ${error.message}</p>`;
    }
}

// Close modal function
function closeModal() {
    document.getElementById('dashboardModal').style.display = 'none';
    document.getElementById('statsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const dashboardModal = document.getElementById('dashboardModal');
    const statsModal = document.getElementById('statsModal');
    
    if (event.target === dashboardModal) {
        dashboardModal.style.display = 'none';
    }
    if (event.target === statsModal) {
        statsModal.style.display = 'none';
    }
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}