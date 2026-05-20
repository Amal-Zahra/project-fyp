const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

/* =========================================
CHAT ROUTE
========================================= */

app.post("/chat", async (req, res) => {

    try {

        const userMessage =
        req.body.message;

        const prompt = `
You are Fusion Beauty AI Assistant.

Fusion Beauty is a luxury beauty brand.

Products:
- Glow Serum
- Velvet Lip Gloss
- Eye Glow Care
- Luxury Skincare

Rules:
- Be elegant and feminine
- Recommend beauty products
- Help with skincare
- ONLY answer beauty/store related questions

Customer Question:
${userMessage}

Assistant:
`;

        const response =
        await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,

            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },

            {
                headers: {
                    "Content-Type":
                    "application/json"
                }
            }
        );

        console.log(response.data);

        const reply =
        response.data
        .candidates[0]
        .content.parts[0]
        .text;

        res.json({
            reply
        });

    } catch (error) {

        console.log("FULL ERROR:");

        console.log(
            error.response?.data ||
            error.message
        );

        res.json({

            reply:
            "✨ Beauty AI is temporarily unavailable."
        });
    }
});

/* =========================================
HOME PAGE
========================================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );
});

/* =========================================
START SERVER
========================================= */

app.listen(3000, () => {

    console.log("");
    console.log("=================================");
    console.log("✅ GEMINI AI RUNNING");
    console.log("🌐 http://localhost:3000");
    console.log("=================================");
    console.log("");
});