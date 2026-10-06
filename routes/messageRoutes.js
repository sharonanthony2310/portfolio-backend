const express = require("express");

const {
    getMessages,
    updateMessageStatus,
    deleteMessage
} = require("../controllers/messageController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    getMessages
);

router.put(
    "/:id/status",
    authenticateToken,
    updateMessageStatus
);

router.delete(
    "/:id",
    authenticateToken,
    deleteMessage
);

module.exports = router;