require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const docx4js = require("docx4js");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());
app.use(require("cors")());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer Storage
const upload = multer({ dest: "uploads/" });


app.post("/analyze-resume", async (req, res) => {
    try {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: "File path is required." });
        }

        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: "File not found." });
        }

        let text = "";
        if (absolutePath.endsWith(".pdf")) {
            const dataBuffer = fs.readFileSync(absolutePath);
            const data = await pdfParse(dataBuffer);
            text = data.text;
        } else if (absolutePath.endsWith(".docx")) {
            const doc = await docx4js.load(absolutePath);
            text = doc.getFullText();
        } else {
            return res.status(400).json({ error: "Invalid file format. Upload PDF or DOCX only." });
        }

        // Send text to AI for analysis
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: `Analyze this resume:\n${text}\nGive skills, experience, and a score out of 100.` }],
            max_tokens: 300,
        });

        res.json({ analysis: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error analyzing resume." });
    }
});
