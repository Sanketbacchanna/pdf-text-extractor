const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    console.log("Extraction complete.");
    fs.writeFileSync('./debug_output.txt', pdfParser.getRawTextContent());
    console.log("Saved to debug_output.txt");
});

pdfParser.loadPDF("./debug_uploaded.pdf");
