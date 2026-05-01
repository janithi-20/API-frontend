document.addEventListener('DOMContentLoaded', () => {
    if (APIService.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

function toggleForms() {
    document.getElementById('loginForm').classList.toggle('active');
    document.getElementById('registerForm').classList.toggle('active');
    clearMessages();
}

function clearMessages() {
    document.querySelectorAll('.form-message').forEach(message => {
        message.textContent = '';
        message.className = 'form-message';
    });
}

function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add(isSuccess ? 'success' : 'error');
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage('loginMessage', 'Please fill in all fields', false);
        return;
    }

    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Logging in...';
    button.disabled = true;

    const result = await APIService.login(username, password);

    button.textContent = originalText;
    button.disabled = false;

    if (result.status === 'success') {
        showMessage('loginMessage', 'Login successful', true);
        setTimeout(() => window.location.href = 'dashboard.html', 400);
    } else {
        showMessage('loginMessage', 'Invalid username or password', false);
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        showMessage('registerMessage', 'Please fill in all fields', false);
        return;
    }

    if (password !== confirmPassword) {
        showMessage('registerMessage', 'Passwords do not match', false);
        return;
    }

    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Registering...';
    button.disabled = true;

    const result = await APIService.register(username, password);

    button.textContent = originalText;
    button.disabled = false;

    if (result.status === 'success') {
        showMessage('registerMessage', 'Registration successful. Please log in.', true);
        event.target.reset();
        setTimeout(() => {
            document.getElementById('registerForm').classList.remove('active');
            document.getElementById('loginForm').classList.add('active');
        }, 800);
    } else {
        showMessage('registerMessage', 'Registration failed', false);
    }
}
