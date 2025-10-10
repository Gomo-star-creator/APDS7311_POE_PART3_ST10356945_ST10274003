console.log('Running index.js from:', __dirname);

require('dotenv').config();
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const paymentsRoutes = require('./routes/payments');

const app = express();

app.use(helmet());
app.use(express.json());

// CORS: restrict to your front-end origin only
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*'
}));

// rate limiter (simple, tune as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);

// health check
app.get('/health', (req, res) => res.json({ ok: true }));
// test homepage route
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

const PORT = process.env.PORT || 3000;


if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH && fs.existsSync(process.env.SSL_KEY_PATH) && fs.existsSync(process.env.SSL_CERT_PATH)) {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running at https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP server running at http://localhost:${PORT}`);
    console.warn('SSL certs not found. For compliance you should run with HTTPS (see README instructions).');
  });
}
