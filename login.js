document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple username/password check (you should use a more secure method for real applications)
    if (username === 'user' && password === 'pass') {
        window.location.href = 'index.html'; // Redirect to the expense tracker page
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
});
