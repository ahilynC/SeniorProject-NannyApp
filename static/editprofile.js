async function fetchProfiles() {
    try {
        const response = await fetch('/api/profiles');
        const result = await response.json();

        if (result.status === 'ok') {
            displayProfiles(result.data);
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

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            // Call editProfile function with profile data
            editProfile(profile);
        });

        profileInfo.appendChild(username);
        profileInfo.appendChild(name);
        profileInfo.appendChild(location);
        profileInfo.appendChild(availability);
        profileInfo.appendChild(role);
        profileInfo.appendChild(gender);
        profileInfo.appendChild(age);
        profileInfo.appendChild(editButton);

        profileCard.appendChild(profileInfo);

        container.appendChild(profileCard);
    });
}

async function editProfile(profile) {
    
    const newName = prompt('Enter new name:', profile.name);
    if (newName !== null) {
        // Update the profile object
        profile.name = newName;
        
        try {
            const response = await fetch(`/api/profiles/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });

            const result = await response.json();

            if (result.status === 'ok') {
                // Profile updated successfully
                // Update the displayed name
                document.querySelector(`.profile-card h2`).textContent = `Username: ${profile.username}`;
                document.querySelector(`.profile-card p:nth-child(2)`).textContent = `Name: ${profile.name}`;
                alert('Profile updated successfully!');
            } else {
                console.error('Error updating profile:', result.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProfiles();
});