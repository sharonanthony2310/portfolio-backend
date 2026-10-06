const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const contentRoutes = require("./routes/contentRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const contactRoutes = require("./routes/contactRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);

app.use("/about", aboutRoutes);

app.use("/upload", uploadRoutes);

app.use("/contact", contactRoutes);

app.use("/media", mediaRoutes);

app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Portfolio CMS API is running"
    });
});

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.get(
    "/protected",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "You accessed a protected route",
            user: req.user
        });
    }
);

app.use("/", contentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});