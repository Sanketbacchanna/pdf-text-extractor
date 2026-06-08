const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for handling file uploads (stored in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoint to process the PDF
app.post('/api/extract-text', upload.single('invoice'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const pdfData = req.file.buffer;

        // Parse the PDF
        const data = await pdfParse(pdfData);

        // Return the extracted text
        res.json({
            success: true,
            text: data.text,
            info: data.info,
            numpages: data.numpages
        });

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process the PDF file. It might be corrupted or encrypted.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
