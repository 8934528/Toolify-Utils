function showRegistrationForm() {
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('securedPage').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('securedPage').style.display = 'none';
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const messageElement = document.getElementById('regMessage');

    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        messageElement.textContent = 'Registration successful!';
        showLoginForm();
    } else {
        messageElement.textContent = 'Please enter both username and password.';
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
        messageElement.textContent = '';
        document.getElementById('securedPage').style.display = 'block';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registrationForm').style.display = 'none';
    } else {
        messageElement.textContent = 'Invalid username or password.';
    }
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    showLoginForm();
}
