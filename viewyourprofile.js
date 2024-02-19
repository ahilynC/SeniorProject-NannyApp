async function fetchUserProfile(username) {
    try {
        const response = await fetch(`/api/profiles/${username}`); // Assuming your API endpoint accepts the username as a parameter
        const result = await response.json();

        if (result.status === 'ok') {
            displayProfile(result.data);
        } else {
            console.error('Error fetching user profile:', result.error);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function displayProfile(profile) {
    const container = document.querySelector('.container');

    const profileCard = document.createElement('div');
    profileCard.classList.add('profile-card');

    const profileInfo = document.createElement('div');
    profileInfo.classList.add('profile-info');

    const usernameElement = document.createElement('h2');
    usernameElement.textContent = `Username: ${profile.username}`;

    const nameElement = document.createElement('p');
    nameElement.textContent = `Name: ${profile.name}`;

    const locationElement = document.createElement('p');
    locationElement.textContent = `Location: ${profile.location}`;

    const availabilityElement = document.createElement('p');
    availabilityElement.textContent = `Availability: ${profile.availability}`;

    const roleElement = document.createElement('p');
    roleElement.textContent = `Role: ${profile.role}`;

    const genderElement = document.createElement('p');
    genderElement.textContent = `Gender: ${profile.gender}`;

    const ageElement = document.createElement('p');
    ageElement.textContent = `Age: ${profile.age}`;

    profileInfo.appendChild(usernameElement);
    profileInfo.appendChild(nameElement);
    profileInfo.appendChild(locationElement);
    profileInfo.appendChild(availabilityElement);
    profileInfo.appendChild(roleElement);
    profileInfo.appendChild(genderElement);
    profileInfo.appendChild(ageElement);

    profileCard.appendChild(profileInfo);
    container.appendChild(profileCard);
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token
    if (token) {
        try {
            const decodedToken = jwt_decode(token); // Decode the JWT token
            const username = decodedToken.username; // Extract the username from the token
            fetchUserProfile(username); // Fetch and display the profile of the logged-in user
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } else {
        console.error('Token not found');
    }
});
