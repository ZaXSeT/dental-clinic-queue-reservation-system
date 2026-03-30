const fs = require('fs');
const { globSync } = require('glob');
const strip = require('strip-comments');

// Hanya proses file di folder client/ dan server/ saja, skip semua node_modules dan build artifacts
const patterns = [
    'client/actions/**/*.{ts,tsx,js,jsx}',
    'client/app/**/*.{ts,tsx,js,jsx}',
    'client/components/**/*.{ts,tsx,js,jsx}',
    'client/hooks/**/*.{ts,tsx,js,jsx}',
    'client/lib/**/*.{ts,tsx,js,jsx}',
    'client/types/**/*.{ts,tsx,js,jsx}',
    'client/utils/**/*.{ts,tsx,js,jsx}',
    'client/store/**/*.{ts,tsx,js,jsx}',
    'server/src/**/*.{ts,tsx,js,jsx}',
];

let allFiles = [];
patterns.forEach(pattern => {
    const found = globSync(pattern, { nodir: true });
    allFiles = allFiles.concat(found);
});

// Deduplicate
allFiles = [...new Set(allFiles)];

console.log(`Ditemukan ${allFiles.length} file untuk diproses...\n`);

let count = 0;
let errors = 0;
allFiles.forEach(file => {
    try {
        const code = fs.readFileSync(file, 'utf8');
        const stripped_code = strip(code);
        if (stripped_code !== code) {
            fs.writeFileSync(file, stripped_code, 'utf8');
            console.log(`✓ ${file}`);
            count++;
        }
    } catch (e) {
        console.error(`✗ Error on ${file}: ${e.message}`);
        errors++;
    }
});

console.log(`\nSelesai! Comment dihapus dari ${count} file. Errors: ${errors}`);
