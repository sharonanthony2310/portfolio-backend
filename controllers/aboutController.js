const pool = require("../config/db");

const getAbout = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM about ORDER BY id DESC LIMIT 1"
        );

        if (result.rows.length === 0) {
            return res.json({
                message: "About content not created yet",
                data: null
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch about content"
        });
    }
};

const updateAbout = async (req, res) => {
    try {
        const {
            title,
            description,
            profile_image,
            resume_url
        } = req.body;

        const existing = await pool.query(
            "SELECT id FROM about ORDER BY id DESC LIMIT 1"
        );

        let result;

        if (existing.rows.length === 0) {
            result = await pool.query(
                `INSERT INTO about
                (title, description, profile_image, resume_url)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [title, description, profile_image, resume_url]
            );
        } else {
            result = await pool.query(
                `UPDATE about
                SET title = $1,
                    description = $2,
                    profile_image = $3,
                    resume_url = $4,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $5
                RETURNING *`,
                [
                    title,
                    description,
                    profile_image,
                    resume_url,
                    existing.rows[0].id
                ]
            );
        }

        res.json({
            message: "About content updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update about content"
        });
    }
};

module.exports = {
    getAbout,
    updateAbout
};