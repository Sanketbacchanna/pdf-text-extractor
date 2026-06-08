const fs = require('fs');

async function testMuPDF() {
    try {
        const mupdf = await import('mupdf');
        const data = fs.readFileSync('debug_uploaded.pdf');
        console.log("Loading document...");
        const doc = mupdf.Document.openDocument(data, "application/pdf");
        const numPages = doc.countPages();
        console.log(`Loaded ${numPages} pages.`);
        
        const page = doc.loadPage(0);
        const pixmap = page.toPixmap(mupdf.Matrix.scale(2, 2), mupdf.ColorSpace.DeviceRGB, false, true);
        
        fs.writeFileSync('output_mupdf.png', pixmap.asPNG());
        console.log("Saved output_mupdf.png");
        
    } catch (e) {
        console.error("MuPDF Error:", e);
    }
}

testMuPDF();
