const express = require("express");

const {
    upload,
    uploadImage
} = require("../controllers/uploadController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/image",
    authenticateToken,
    upload.single("image"),
    uploadImage
);

module.exports = router;