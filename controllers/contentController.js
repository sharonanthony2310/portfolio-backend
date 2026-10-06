const pool = require("../config/db");

const tables = {
    skills: {
        table: "skills",
        fields: ["name", "category", "proficiency", "icon"]
    },
    projects: {
        table: "projects",
        fields: [
            "title",
            "slug",
            "description",
            "image",
            "technologies",
            "project_url",
            "github_url",
            "featured"
        ]
    },
    blogs: {
        table: "blogs",
        fields: [
            "title",
            "slug",
            "excerpt",
            "content",
            "cover_image",
            "author",
            "published"
        ]
    },
    experience: {
        table: "experience",
        fields: [
            "company",
            "position",
            "description",
            "start_date",
            "end_date",
            "current_position",
            "location"
        ]
    },
    testimonials: {
        table: "testimonials",
        fields: [
            "name",
            "role",
            "company",
            "message",
            "image"
        ]
    },
    services: {
        table: "services",
        fields: [
            "title",
            "description",
            "icon"
        ]
    }
};

const getConfig = (type) => {
    return tables[type];
};

const getAll = async (req, res) => {
    try {
        const config = getConfig(req.params.type);

        if (!config) {
            return res.status(404).json({
                message: "Content type not found"
            });
        }

        const result = await pool.query(
            `SELECT * FROM ${config.table} ORDER BY id DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch content"
        });
    }
};

const getOne = async (req, res) => {
    try {
        const config = getConfig(req.params.type);

        if (!config) {
            return res.status(404).json({
                message: "Content type not found"
            });
        }

        const result = await pool.query(
            `SELECT * FROM ${config.table} WHERE id = $1`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch content"
        });
    }
};

const create = async (req, res) => {
    try {
        const config = getConfig(req.params.type);

        if (!config) {
            return res.status(404).json({
                message: "Content type not found"
            });
        }

        const fields = config.fields.filter(
            field => req.body[field] !== undefined
        );

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No valid fields provided"
            });
        }

        const values = fields.map(field => req.body[field]);

        const placeholders = fields
            .map((_, index) => `$${index + 1}`)
            .join(", ");

        const result = await pool.query(
            `INSERT INTO ${config.table}
            (${fields.join(", ")})
            VALUES (${placeholders})
            RETURNING *`,
            values
        );

        res.status(201).json({
            message: "Content created successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create content"
        });
    }
};

const update = async (req, res) => {
    try {
        const config = getConfig(req.params.type);

        if (!config) {
            return res.status(404).json({
                message: "Content type not found"
            });
        }

        const fields = config.fields.filter(
            field => req.body[field] !== undefined
        );

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No valid fields provided"
            });
        }

        const values = fields.map(field => req.body[field]);

        const setClause = fields
            .map((field, index) => `${field} = $${index + 1}`)
            .join(", ");

        values.push(req.params.id);

        const result = await pool.query(
            `UPDATE ${config.table}
            SET ${setClause}
            WHERE id = $${values.length}
            RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        res.json({
            message: "Content updated successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update content"
        });
    }
};

const remove = async (req, res) => {
    try {
        const config = getConfig(req.params.type);

        if (!config) {
            return res.status(404).json({
                message: "Content type not found"
            });
        }

        const result = await pool.query(
            `DELETE FROM ${config.table}
            WHERE id = $1
            RETURNING *`,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }

        res.json({
            message: "Content deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete content"
        });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};