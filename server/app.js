const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helmet = require('helmet')

const authRoutes = require('./routes/security/authRoutes');
const userRoutes = require('./routes/business/userRoutes');
const productRoutes = require('./routes/business/productRoutes');
const fakeStoreRoutes = require('./routes/external_api_sampler/fakeStoreRoute');
const dashboardRoutes = require('./routes/admin/dashboardRoutes');
const orderRoutes = require('./routes/business/orderRoutes');
const notFoundRoutes = require("./routes/NotFoundRoutes");
const User = require("./models/User"); // Import User Model

// Initialize environment variables
dotenv.config();

const app = express();
app.use(helmet(
    {
        contentSecurityPolicy: false, // Disables CSP for development purposes.
        xssFilter: true, // Activates XSS filtering.
        noSniff: true, // Prevents MIME type sniffing.
    }
))
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/auth', productRoutes);
app.use('/api/auth', fakeStoreRoutes);
app.use("/api/auth", dashboardRoutes);
app.use("/api/auth", orderRoutes);
app.use("/api/auth", notFoundRoutes);

// OAuth Setup
const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const GOOGLE_CALLBACK_URL = "http://localhost:5000/google/callback";
const GOOGLE_OAUTH_SCOPES = [
    "https%3A//www.googleapis.com/auth/userinfo.email",
    "https%3A//www.googleapis.com/auth/userinfo.profile",
];

// Redirect to Google OAuth Consent Screen
app.get("/", async (req, res) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join("%20");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

// Google OAuth Callback
app.get("/google/callback", async (req, res) => {
    try {
        console.log(req.query);
        const { code } = req.query;

        const data = {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code",
        };

        // Exchange authorization code for tokens
        const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
        });

        const access_token_data = await response.json();
        if (!access_token_data.id_token) {
            return res.status(400).json({ error: "Failed to obtain ID token" });
        }

        const { id_token } = access_token_data;

        // Verify token and extract user info
        const token_info_response = await fetch(
            `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
        );
        const token_info_data = await token_info_response.json();

        if (!token_info_data.email) {
            return res.status(400).json({ error: "Failed to retrieve user email" });
        }

        const { email, email_verified } = token_info_data;

        if (!email_verified) {
            return res.status(400).json({ error: "Email is not verified" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=EmailNotFound`);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email, role: user.role, profileImageUrl: user.profileImageUrl },
            process.env.JWT_SECRET,
            { expiresIn: "7h" }
        );

        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/google-auth-success?token=${token}`);

    } catch (error) {
        console.error("OAuth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=OAuthFailed`);
    }
});

// Export the app instance
module.exports = app;