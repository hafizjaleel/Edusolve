import fs from 'fs';

const teachers = JSON.parse(fs.readFileSync('./data_collection/teachers_master.json', 'utf8'));

const idMap = new Map();
const duplicates = [];

teachers.forEach(t => {
    const id = (t['Teacher ID'] || '').trim().toUpperCase();
    const name = (t['Teacher Nmae'] || '').trim();
    
    if (idMap.has(id)) {
        duplicates.push({
            id,
            originalName: idMap.get(id),
            duplicateName: name
        });
    } else {
        idMap.set(id, name);
    }
});

console.log('Duplicate Teachers Found:');
duplicates.forEach(d => {
    console.log(`- ID: ${d.id} | Name 1: ${d.originalName} | Name 2: ${d.duplicateName}`);
});
