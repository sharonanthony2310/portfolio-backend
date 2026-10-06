const express = require("express");

const {
    getMedia,
    deleteMedia
} = require("../controllers/mediaController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getMedia);

router.delete(
    "/:id",
    authenticateToken,
    deleteMedia
);

module.exports = router;