const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'dist');
const FILES = ['index.html', 'app.js', 'styles.css'];

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

FILES.forEach((file) => {
    fs.copyFileSync(path.join(__dirname, file), path.join(OUTPUT_DIR, file));
});

console.log(`Built ${FILES.length} files in ${OUTPUT_DIR}`);
