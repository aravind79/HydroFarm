const fs = require('fs');
const path = require('path');

const scale = 30 / 22; // ~1.3636

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Scale px values
    content = content.replace(/font-size:\s*([\d.]+)px/g, (match, p1) => {
        const newSize = Math.round(parseFloat(p1) * scale);
        return `font-size: ${newSize}px`;
    });

    // Scale vw values
    content = content.replace(/font-size:\s*([\d.]+)vw/g, (match, p1) => {
        const newSize = (parseFloat(p1) * scale).toFixed(1);
        return `font-size: ${newSize}vw`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

processFile(path.join(__dirname, 'public', 'styles.css'));
processFile(path.join(__dirname, 'public', 'index.html'));
