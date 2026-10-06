const multer = require("multer");
const path = require("path");
const pool = require("../config/db");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const filePath = "/uploads/" + req.file.filename;

        const result = await pool.query(
            `INSERT INTO media
            (filename, original_name, file_path, file_type, file_size, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                req.file.filename,
                req.file.originalname,
                filePath,
                req.file.mimetype,
                req.file.size,
                req.user.id
            ]
        );

        res.status(201).json({
            message: "Image uploaded successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Image upload failed"
        });
    }
};

module.exports = {
    upload,
    uploadImage
};