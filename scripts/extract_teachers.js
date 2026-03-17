const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = 'e:\\Qubes\\Edusolve\\data_collection\\teachers_master.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

fs.writeFileSync('e:\\Qubes\\Edusolve\\data_collection\\teachers_master.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${data.length} records to teachers_master.json`);
