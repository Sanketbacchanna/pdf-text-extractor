const fs = require('fs');

const data = fs.readFileSync('debug_uploaded.pdf');

// Convert to string (ignoring binary)
const str = data.toString('latin1');

// Basic regex to find strings inside PDF parentheses: (...) Tj or [...] TJ
const tjRegex = /\((.*?)\)\s*T[jJ]/g;
let match;
const extracted = [];
while ((match = tjRegex.exec(str)) !== null) {
    extracted.push(match[1]);
}

console.log("Extracted from Tj:", extracted.slice(0, 20));

// Also check for array TJ: [ (text) num (text) ] TJ
const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
const arrayExtracted = [];
while ((match = arrayTjRegex.exec(str)) !== null) {
    const innerStr = match[1];
    const innerRegex = /\((.*?)\)/g;
    let innerMatch;
    let combined = "";
    while ((innerMatch = innerRegex.exec(innerStr)) !== null) {
        combined += innerMatch[1];
    }
    if (combined) arrayExtracted.push(combined);
}

console.log("Extracted from array TJ:", arrayExtracted.slice(0, 20));
