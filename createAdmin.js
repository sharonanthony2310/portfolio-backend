require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const createAdmin = async () => {
    try {
        const name = "Admin";
        const email = "admin@portfolio.com";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4)`,
            [name, email, hashedPassword, "admin"]
        );

        console.log("Admin user created successfully");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();