const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const outPath = process.argv[3];
if (!filePath || !outPath) {
    console.error('Please provide input file path and output json path');
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
        result[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log(`Success: Data written to ${outPath}`);
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}
