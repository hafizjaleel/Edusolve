const fs = require('fs');

const csvPath = 'e:/Qubes/Edusolve/data_collection/AC8.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');
const headers = lines[0].split(',').map(h => h.trim());

const data = lines.slice(1).map(line => {
  // Simple CSV parse handling quotes
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());

  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = cells[i] || '';
  });
  return obj;
});

fs.writeFileSync('e:/Qubes/Edusolve/data_collection/AC8_data.json', JSON.stringify({ Sheet1: data }, null, 2));
console.log('Converted AC8.csv to AC8_data.json');
