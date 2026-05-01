# Task Manager Application

A simple task management app built with PHP, MySQL, and vanilla JavaScript.

## Features

- User registration and login
- Add, view, and manage tasks
- Task completion status tracking
- Token-based authentication
- Responsive design

## Requirements

- XAMPP (or Apache + PHP + MySQL)
- PHP 7.2 or higher
- MySQL 5.7 or higher

## Installation & Setup

### Step 1: Clone the Project
```bash
git clone <your-repo-url>
cd API
```

### Step 2: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services

### Step 3: Access the Application
Open your browser and navigate to:
```
http://localhost/API/index.html
```

### Step 4: Database Setup (Automatic)
The database will be created automatically on first registration attempt. The app will:
- Create `task_app` database
- Create `users` table
- Create `tasks` table

**No manual database setup is required!**

### Optional: Manual Database Setup
If auto-creation fails, you can manually import the schema:

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Go to **Import**
3. Select `schema.sql` from the project folder
4. Click **Import**

## Project Structure

```
/API
├── index.html          # Login/Register page
├── dashboard.html      # Task management dashboard
├── styles.css          # Application styling
├── api.js             # API service layer
├── auth.js            # Authentication logic
├── dashboard.js       # Dashboard functionality
├── register.php       # User registration endpoint
├── login.php          # User login endpoint
├── logout.php         # User logout endpoint
├── add_task.php       # Add task endpoint
├── get_task.php       # Get tasks endpoint
├── db.php             # Database connection & auto-setup
└── schema.sql         # Database schema (manual setup)
```

## How It Works

### Frontend
- **index.html** - Login/Register form
- **dashboard.html** - Task list and management interface
- **api.js** - Handles all HTTP requests to PHP endpoints
- **auth.js** - Handles form submission logic
- **dashboard.js** - Manages task operations

### Backend
- **db.php** - Connects to MySQL and auto-creates database/tables
- **register.php** - Creates new user accounts
- **login.php** - Authenticates users and returns JWT token
- **logout.php** - Clears user token
- **add_task.php** - Creates new tasks
- **get_task.php** - Retrieves user's tasks

## Database Details

**Database Name:** `task_app`

### Users Table
- `id` - Primary key
- `username` - Unique username (100 chars max)
- `password` - Hashed password
- `token` - Authentication token

### Tasks Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `task` - Task description (255 chars max)
- `completed` - Completion status (0 or 1)
- `created_at` - Timestamp

## Troubleshooting

### "Registration failed" Error
1. Ensure MySQL is running in XAMPP
2. Check that `db.php` can connect to MySQL
3. Try importing `schema.sql` manually if auto-creation fails

### "Can't log in" Error
1. Verify you registered with the correct credentials
2. Check that the `users` table exists in phpMyAdmin
3. Ensure cookies/localStorage are enabled in your browser

### Database Connection Issues
1. Verify MySQL is running (`http://localhost/phpmyadmin` should work)
2. Check the credentials in `db.php` match your MySQL setup
3. Ensure `task_app` database exists or auto-creates on first request

## Development Notes

- All passwords are hashed with PHP's `password_hash()` function
- Authentication uses token-based system stored in localStorage
- Frontend communicates with backend via JSON/fetch API
- Database uses UTF8MB4 charset for full Unicode support

## License

This project is open source.
