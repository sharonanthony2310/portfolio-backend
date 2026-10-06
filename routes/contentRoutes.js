const express = require("express");

const {
    getAll,
    getOne,
    create,
    update,
    remove
} = require("../controllers/contentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:type", getAll);

router.get("/:type/:id", getOne);

router.post("/:type", authenticateToken, create);

router.put("/:type/:id", authenticateToken, update);

router.delete("/:type/:id", authenticateToken, remove);

module.exports = router;