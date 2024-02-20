

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
async function fetchProfiles(username) {
    try {
        const response = await fetch('/api/profiles');
        const result = await response.json();

        if (result.status === 'ok') {
            filterProfiles(result.data, username);
        } else {
            console.error('Error fetching profiles:', result.error);
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
}



function filterProfiles(profiles, myusername) {
    const container = document.querySelector('.container');

    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        const profileInfo = document.createElement('div');
        profileInfo.classList.add('profile-info');

        const username = document.createElement('h2');
        username.textContent = `Username: ${profile.username}`;

        const name = document.createElement('p');
        name.textContent = `Name: ${profile.name}`;

        const location = document.createElement('p');
        location.textContent = `Location: ${profile.location}`;

        const availability = document.createElement('p');
        availability.textContent = `Availability: ${profile.availability}`;

        const role = document.createElement('p');
        role.textContent = `Role: ${profile.role}`;

        const gender = document.createElement('p');
        gender.textContent = `Gender: ${profile.gender}`;

        const age = document.createElement('p');
        age.textContent = `Age: ${profile.age}`;

        profileInfo.appendChild(username);
        profileInfo.appendChild(name);
        profileInfo.appendChild(location);
        profileInfo.appendChild(availability);
        profileInfo.appendChild(role);
        profileInfo.appendChild(gender);
        profileInfo.appendChild(age);
        profileCard.appendChild(profileInfo);
        if (myusername == profile.username) {
            container.appendChild(profileCard);
        }


    })
    if (container) {
        container.addEventListener('click', (event) => {
            const profileCard = event.target.closest('.profile-card');
            if (profileCard) {
                // Retrieve the username from the clicked profile card
                const username = profileCard.dataset.username;
                // Redirect to the appointment page with the selected profile's username
                window.location.href = `/makeappointment.html?profile=${username}`;
            }
        });
    } else {
        console.error('Container element not found');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usrnm = getUsername()
    fetchProfiles(usrnm);
});
