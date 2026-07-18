const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../../frontend")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", routes);

// Landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

module.exports = app;