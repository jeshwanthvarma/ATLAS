const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Security Headers (Helmet + Firebase Support)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "'unsafe-eval'",
                    "https://www.gstatic.com",
                    "https://www.googleapis.com"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com"
                ],

                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "data:"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "https://www.gstatic.com",
                    "https://www.google.com",
                    "https://www.googleapis.com"
                ],

                connectSrc: [
                    "'self'",
                    "https://identitytoolkit.googleapis.com",
                    "https://securetoken.googleapis.com",
                    "https://www.googleapis.com",
                    "https://firebasestorage.googleapis.com"
                ],

                objectSrc: ["'none'"],
                upgradeInsecureRequests: []
            }
        }
    })
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve Frontend
app.use(express.static(path.join(__dirname, "../../frontend")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Landing Page
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

module.exports = app;