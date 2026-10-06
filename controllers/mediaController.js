const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const getMedia = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                filename,
                original_name,
                file_path,
                file_type,
                file_size,
                uploaded_by,
                created_at
             FROM media
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch media"
        });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM media WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Media not found"
            });
        }

        const media = result.rows[0];

        const relativePath = media.file_path.replace(
            /^\/uploads\//,
            ""
        );

        const filePath = path.join(
            __dirname,
            "..",
            "uploads",
            relativePath
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await pool.query(
            "DELETE FROM media WHERE id = $1",
            [id]
        );

        res.json({
            message: "Media deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete media"
        });
    }
};

module.exports = {
    getMedia,
    deleteMedia
};