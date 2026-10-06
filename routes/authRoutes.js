const express = require("express");

const {
    login,
    refreshAccessToken
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);

router.post(
    "/refresh",
    refreshAccessToken
);

module.exports = router;