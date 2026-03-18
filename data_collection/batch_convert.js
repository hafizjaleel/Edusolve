const XLSX = require('xlsx');
const fs = require('fs');

const files = [
  'e:/Qubes/Edusolve/data_collection/AC2.xlsx',
  'e:/Qubes/Edusolve/data_collection/ac4.xlsx',
  'e:/Qubes/Edusolve/data_collection/AC6.xlsx'
];

files.forEach(file => {
  try {
    const workbook = XLSX.readFile(file);
    const result = {};
    workbook.SheetNames.forEach(sheetName => {
      const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (roa.length) result[sheetName] = roa;
    });
    const outFile = file.replace('.xlsx', '_data.json');
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
    console.log(`Converted ${file} to ${outFile}`);
  } catch (err) {
    console.error(`Error converting ${file}:`, err.message);
  }
});
