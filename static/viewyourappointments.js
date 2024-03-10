function storeToken(token) {
    localStorage.setItem('token', token);
}

// Function to store JWT token in session storage
function storeTokenInSession(token) {
    sessionStorage.setItem('token', token);
}
function getUserId() {
    // Retrieve the JWT token from local storage or session storage
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    // Decode the JWT token to extract user information
    if (token) {
        try {
            // Decode the token
            const decodedToken = jwt_decode(token);
            console.log("Decoded Token:", decodedToken);
            // Assuming the decoded token contains the user ID
            const userId = decodedToken.id;
            return userId;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        console.error('Token not found');
        return null;
    }
}

// Function to get username from the JWT token
function getUsername() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            // Adjust the property name based on your JWT structure
            return decodedToken.username; // Assuming 'username' is the property name
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        console.error('Token not found');
        return null;
    }
}
const myUserName = getUsername();

async function fetchAppointments(username) {
    try {
        const response = await fetch('/api/appointments');
        const result = await response.json();

        if (result.status === 'ok') {
            filterAppointments(result.data, username);
        } else {
            console.error('Error fetching appointments:', result.error);
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}



function filterAppointments(appointments, myusername) {
    const container = document.querySelector('.container');

    appointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');

        const appointmentInfo = document.createElement('div');
        appointmentInfo.classList.add('appointment-info');

        const username = document.createElement('h2');
        username.textContent = `Username: ${appointment.username}`;

        const userId = document.createElement('p');
        userId.textContent = `User ID: ${appointment.userId}`;

        const dateTime = document.createElement('p');
        dateTime.textContent = `Date: ${appointment.dateTime}`;

        appointmentInfo.appendChild(username);
        appointmentInfo.appendChild(userId);
        appointmentInfo.appendChild(dateTime);
        appointmentCard.appendChild(appointmentInfo);
        if (myusername === appointment.username) { // Use strict equality operator
            container.appendChild(appointmentCard);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const usrnm = getUsername()
    fetchAppointments(usrnm);
});