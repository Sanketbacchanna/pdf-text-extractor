const fs = require('fs');
const Tesseract = require('tesseract.js');

async function extractWithOCR() {
    console.log("Starting MuPDF + Tesseract extraction...");
    try {
        const mupdf = await import('mupdf');
        const data = fs.readFileSync('debug_uploaded.pdf');
        
        console.log("Loading corrupted PDF with MuPDF...");
        const doc = mupdf.Document.openDocument(data, "application/pdf");
        const numPages = doc.countPages();
        console.log(`Loaded ${numPages} pages.`);
        
        let fullText = "";
        
        for (let i = 0; i < numPages; i++) {
            console.log(`Rendering page ${i + 1}...`);
            const page = doc.loadPage(i);
            // Render to high-res pixmap for OCR
            const pixmap = page.toPixmap(mupdf.Matrix.scale(2, 2), mupdf.ColorSpace.DeviceRGB, false, true);
            const imageBuffer = pixmap.asPNG();
            
            console.log(`Running OCR on page ${i + 1}...`);
            const { data: { text } } = await Tesseract.recognize(
                imageBuffer,
                'eng',
                { logger: m => {} } 
            );
            
            fullText += `--- Page ${i + 1} ---\n${text}\n\n`;
        }
        
        console.log("=== EXTRACTION COMPLETE ===");
        console.log(fullText.substring(0, 500));
        fs.writeFileSync('extracted_text.txt', fullText);
        console.log("Saved full text to extracted_text.txt");
        
    } catch (e) {
        console.error("Extraction Error:", e);
    }
}

extractWithOCR();
