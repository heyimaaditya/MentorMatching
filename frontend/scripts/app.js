const API_BASE = 'http://localhost:5000/api';

// Helper function for API requests.
async function apiRequest(endpoint, method, data = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  // Clone the response immediately so we can use it if JSON parsing fails.
  const responseClone = response.clone();
  let result;
  try {
    result = await response.json();
  } catch (error) {
    const text = await responseClone.text(); 
    console.error(`Error parsing JSON response from ${endpoint}:`, text);
    throw new Error('Failed to parse JSON response.');
  }

  return { status: response.status, result };
}

// Register User.
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim(),
  };

  try {
    const { status, result } = await apiRequest('/auth/register', 'POST', data);
    alert(result.message);
    if (status === 201) {
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
});

// Login User.
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim(),
  };

  try {
    const { status, result } = await apiRequest('/auth/login', 'POST', data);
    alert(result.message);
    if (status === 200 && result.token) {
      localStorage.setItem('token', result.token);
      window.location.href = 'profile.html';
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
});

// Create or Update Profile using the dedicated GET /profile/me endpoint.
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a profile.');
      return window.location.href = 'login.html';
    }
  
    // Ensure role is lowercase.
    const roleInput = document.getElementById('role').value.trim().toLowerCase();
    const data = {
      role: roleInput,
      skills: document.getElementById('skills').value.trim(),
      interests: document.getElementById('interests').value.trim(),
      bio: document.getElementById('bio').value.trim(),
    };
  
    console.log('Profile Data:', data);
  
    try {
      // Use dedicated endpoint to get the current user's profile.
      let response = await apiRequest('/profile/me', 'GET', null, token);
      // Check if we got a valid profile.
      if (response.status === 200 && response.result.profile) {
        // If a profile exists, update it.
        const updateResp = await apiRequest('/profile', 'PUT', data, token);
        alert(updateResp.result.message);
      } else if (response.status === 404) {
        // No profile found; create a new profile.
        const createResp = await apiRequest('/profile', 'POST', data, token);
        alert(createResp.result.message);
      } else {
        // If response is not 200 or 404, throw an error.
        throw new Error('Unexpected response.');
      }
    } catch (error) {
      console.error('Profile error:', error);
      alert('Profile update failed.');
    }
  });

document.getElementById('deleteProfileBtn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete your profile.');
      return;
    }
    if (!confirm('Are you sure you want to delete your profile? This action is irreversible.')) {
      return;
    }
    try {
      const { status, result } = await apiRequest('/profile', 'DELETE', null, token);
      if (status === 200) {
        alert(result.message);
        // Possibly redirect user to another page
        window.location.href = 'login.html';
      } else {
        alert(result.message || 'Profile deletion failed.');
      }
    } catch (error) {
      console.error('Profile deletion error:', error);
      alert('Profile deletion failed.');
    }
  });
  
  document.getElementById('applyFilters')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view profiles.');
      return window.location.href = 'login.html';
    }
    const role = document.getElementById('filterRole').value.trim();
    const skills = document.getElementById('filterSkills').value.trim();
    const interests = document.getElementById('filterInterests').value.trim();
  
    let query = '?';
    if (role) query += `role=${encodeURIComponent(role)}&`;
    if (skills) query += `skills=${encodeURIComponent(skills)}&`;
    if (interests) query += `interests=${encodeURIComponent(interests)}&`;
    
    try {
      const { status, result } = await apiRequest(`/profile${query}`, 'GET', null, token);
      if (status === 200 && result.profiles) {
        const profilesList = document.getElementById('profilesList');
        profilesList.innerHTML = '';
        result.profiles.forEach((profile) => {
          const card = document.createElement('div');
          card.className = 'profile-card';
          card.innerHTML = `
            <h3>${profile.username} (${profile.role})</h3>
            <p><strong>Skills:</strong> ${profile.skills || 'N/A'}</p>
            <p><strong>Interests:</strong> ${profile.interests || 'N/A'}</p>
            <p>${profile.bio || ''}</p>
            <button class="requestBtn" data-userid="${profile.user_id}">Send Mentorship Request</button>
          `;
          profilesList.appendChild(card);
        });
  
        // Attach click handlers for request buttons
        document.querySelectorAll('.requestBtn').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            const mentorId = ev.target.getAttribute('data-userid');
            sendMentorshipRequest(mentorId);
          });
        });
      }
    } catch (error) {
      console.error('Discovery error:', error);
      alert('Failed to load profiles.');
    }
  });
  
  // Helper function to send mentorship request
  async function sendMentorshipRequest(mentorId) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to send a request.');
      return;
    }
  
    try {
      const { status, result } = await apiRequest('/mentorship', 'POST', { mentor_id: mentorId }, token);
      if (status === 201) {
        alert('Mentorship request sent successfully.');
      } else {
        alert(result.message || 'Could not send mentorship request.');
      }
    } catch (error) {
      console.error('Send request error:', error);
      alert('Request failed.');
    }
  }
  
document.addEventListener('DOMContentLoaded', async () => {
    const isRequestsPage = window.location.pathname.includes('requests.html');
    if (!isRequestsPage) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view mentorship requests.');
      window.location.href = 'login.html';
      return;
    }
  
    try {
      const { status, result } = await apiRequest('/mentorship', 'GET', null, token);
      if (status === 200 && result.requests) {
        renderRequests(result.requests);
      } else {
        alert(result.message || 'Failed to load requests.');
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  });
  
  function renderRequests(requests) {
    const container = document.getElementById('requestsContainer');
    container.innerHTML = '';
    requests.forEach(req => {
      const div = document.createElement('div');
      div.className = 'request-card';
      div.innerHTML = `
        <p><strong>Request ID:</strong> ${req.id}</p>
        <p><strong>Mentor:</strong> ${req.mentor_name} (ID: ${req.mentor_id})</p>
        <p><strong>Mentee:</strong> ${req.mentee_name} (ID: ${req.mentee_id})</p>
        <p><strong>Status:</strong> ${req.status}</p>
        ${
          req.status === 'pending' 
          ? `<button class="accept-btn" data-reqid="${req.id}">Accept</button>
             <button class="decline-btn" data-reqid="${req.id}">Decline</button>`
          : ''
        }
        <hr>
      `;
      container.appendChild(div);
    });
  
    // Add event listeners for accept/decline
    document.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRequestUpdate(btn.getAttribute('data-reqid'), 'accepted'));
    });
    document.querySelectorAll('.decline-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRequestUpdate(btn.getAttribute('data-reqid'), 'declined'));
    });
  }
  
  async function handleRequestUpdate(requestId, status) {
    const token = localStorage.getItem('token');
    try {
      const { status: putStatus, result } = await apiRequest(`/mentorship/${requestId}`, 'PUT', { status }, token);
      if (putStatus === 200) {
        alert('Request updated!');
        // Reload or re-fetch requests
        window.location.reload();
      } else {
        alert(result.message || 'Could not update request.');
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  }
  
  
  
