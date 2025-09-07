const express = require('express');
const path = require('path');
const cors = require('cors');

// Import API handlers
const loginHandler = require('./api/auth/login');
const registerHandler = require('./api/auth/register');
const verifyHandler = require('./api/auth/verify');
const userDataHandler = require('./api/user/data');
const sessionsHandler = require('./api/timer/sessions');
const dashboardHandler = require('./api/analytics/dashboard');
const statisticsHandler = require('./api/analytics/statistics');
const targetCgpaHandler = require('./api/analytics/target-cgpa');
const backupHandler = require('./api/admin/backup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Wrapper function to adapt Vercel-style handlers to Express
const adaptHandler = (handler) => {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error('API Handler Error:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };
};

// API Routes
app.all('/api/auth/login', adaptHandler(loginHandler));
app.all('/api/auth/register', adaptHandler(registerHandler));
app.all('/api/auth/verify', adaptHandler(verifyHandler));
app.all('/api/user/data', adaptHandler(userDataHandler));
app.all('/api/timer/sessions', adaptHandler(sessionsHandler));
app.all('/api/analytics/dashboard', adaptHandler(dashboardHandler));
app.all('/api/analytics/statistics', adaptHandler(statisticsHandler));
app.all('/api/analytics/target-cgpa', adaptHandler(targetCgpaHandler));
app.all('/api/admin/backup', adaptHandler(backupHandler));

// SPA Routes - serve appropriate HTML files
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'analytics.html'));
});

app.get('/timer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'timer.html'));
});

const server = app.listen(PORT, () => {
    console.log(`🚀 StudyMetrics server running on http://localhost:${PORT}`);
    console.log(`📊 Analytics dashboard: http://localhost:${PORT}/analytics.html`);
    console.log(`⏰ Study timer: http://localhost:${PORT}/timer.html`);
    console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`👤 Register: http://localhost:${PORT}/register.html`);
    console.log(`\n🔑 Admin credentials: admin / 4129`);
    console.log(`💾 Admin can download database backups`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
