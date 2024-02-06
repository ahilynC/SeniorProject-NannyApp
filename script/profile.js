// profile.js
document.getElementById('profile-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Add logic to handle form submission and save profile information
    // You can use fetch to send the data to your server
    const fullName = document.getElementById('full-name').value;
    // Get other form field values as needed

    // Send data to the server (replace with your API endpoint)
    fetch('/api/save-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullName,
            // Include other profile information in the body
        }),
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'ok') {
            // Optionally, you can redirect the user to another page after successful submission
            window.location.href = '/dashboard';
        } else {
            alert('Failed to save profile. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error saving profile:', error);
        alert('An error occurred. Please try again later.');
    });
});