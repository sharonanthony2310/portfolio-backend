const pool = require("../config/db");
const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        if (!name || !email || !message) {

            return res.status(400).json({
                message:
                    "Name, email and message are required"
            });
        }


        const result = await pool.query(
            `INSERT INTO messages
            (name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                name,
                email,
                subject || "",
                message
            ]
        );


        let emailSent = false;


        if (
            process.env.EMAIL_USER &&
            process.env.EMAIL_PASS
        ) {

            try {

                const transporter =
                    nodemailer.createTransport({
                        service: "gmail",

                        auth: {
                            user:
                                process.env.EMAIL_USER,

                            pass:
                                process.env.EMAIL_PASS
                        }
                    });


                await transporter.sendMail({

                    from:
                        process.env.EMAIL_USER,

                    to:
                        process.env.EMAIL_USER,

                    replyTo:
                        email,

                    subject:
                        `Portfolio Contact: ${
                            subject ||
                            "New Message"
                        }`,

                    text:
`You received a new message from your portfolio.

Name: ${name}

Email: ${email}

Subject: ${
    subject || "No subject"
}

Message:

${message}
`
                });


                emailSent = true;

            } catch (emailError) {

                console.error(
                    "EMAIL NOTIFICATION FAILED:"
                );

                console.error(
                    emailError.message
                );
            }
        }


        res.status(201).json({

            message:
                "Contact message sent successfully",

            emailSent,

            data:
                result.rows[0]
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Failed to send contact message"
        });
    }
};


module.exports = {
    sendContactMessage
};