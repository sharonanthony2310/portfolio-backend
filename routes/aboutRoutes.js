const express = require("express");

const {
    getAbout,
    updateAbout
} = require("../controllers/aboutController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAbout);

router.put("/", authenticateToken, updateAbout);

module.exports = router;