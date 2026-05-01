const API_BASE = 'http://localhost/API';

class APIService {
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static clearToken() {
        localStorage.removeItem('token');
    }

    static getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: token } : {})
        };
    }

    static async register(username, password) {
        try {
            const response = await fetch(`${API_BASE}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Network error' };
        }
    }

    static async login(username, password) {
        try {
            const response = await fetch(`${API_BASE}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.status === 'success') {
                this.setToken(data.token);
                localStorage.setItem('username', username);
            }
            return data;
        } catch (error) {
            return { status: 'error', message: 'Network error' };
        }
    }

    static async logout() {
        try {
            const response = await fetch(`${API_BASE}/logout.php`, {
                method: 'POST',
                headers: this.getHeaders()
            });
            const data = await response.json();
            this.clearToken();
            localStorage.removeItem('username');
            return data;
        } catch (error) {
            this.clearToken();
            localStorage.removeItem('username');
            return { status: 'success' };
        }
    }

    static async addTask(task) {
        try {
            const response = await fetch(`${API_BASE}/add_task.php`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ task })
            });
            return await response.json();
        } catch (error) {
            return { status: 'error', message: 'Network error' };
        }
    }

    static async getTasks() {
        const response = await fetch(`${API_BASE}/get_task.php`, {
            method: 'GET',
            headers: this.getHeaders()
        });

        if (response.status === 401) {
            this.clearToken();
            localStorage.removeItem('username');
            window.location.href = 'index.html';
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
}
