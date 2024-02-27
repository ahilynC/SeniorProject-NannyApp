async function fetchProfiles() {
    try {
        const response = await fetch('/api/profiles');
        const result = await response.json();

        if (result.status === 'ok') {
            displayProfiles(result.data);
            console.log("Fetched profiles:", result.data);
        } else {
            console.error('Error fetching profiles:', result.error);
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
    }
}

function displayProfiles(profiles) {
    const container = document.querySelector('.container');

    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        profileCard.dataset.username = profile.username;
        console.log("Displaying profile:", profile.username);  

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

        container.appendChild(profileCard);
    })
    if (container) {
        container.addEventListener('click', (event) => {
            // Corrected to find the closest `.profile-card` instead of `.container`
            const profileCard = event.target.closest('.profile-card');
            if (profileCard) {
                // Retrieve the username from the clicked profile card
                const nannysUsername = profileCard.dataset.username;
                console.log(nannysUsername);
                // Redirect to the appointment page with the selected profile's username
                window.location.href = `/makeappointment.html?profile=${nannysUsername}`;
            }
        });
    } else {
        console.error('Container element not found');
    }
}
function getNannyUsernameFromURL() {
    // Create a URLSearchParams object from the current window location search string
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the 'profile' query parameter value, which holds the nanny's username
    const nannyUsername = urlParams.get('profile');
    
    return nannyUsername;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProfiles();

    const nannyUsername = getNannyUsernameFromURL();
    if (nannyUsername) {
        console.log("Nanny's Username:", nannyUsername);
        // Here you can call your function to make an appointment with the nanny's username
        // For example:
        // makeAppointmentWithNanny(nannyUsername);
    } else {
        console.error('Nanny username not found in the URL');
    }
});