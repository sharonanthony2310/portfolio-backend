const pool = require("../config/db");

const getMessages = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM messages
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
};

const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        if (!["read", "unread"].includes(status)) {
            return res.status(400).json({
                message: "Status must be read or unread"
            });
        }

        const result = await pool.query(
            `UPDATE messages
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.json({
            message: "Message status updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update message"
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM messages
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete message"
        });
    }
};

module.exports = {
    getMessages,
    updateMessageStatus,
    deleteMessage
};