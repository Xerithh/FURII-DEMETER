const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('src/stores'), ...walk('src/services')];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    if (content.includes("'/api/v1")) {
        content = content.replace(/'\/api\/v1/g, "'/v1");
        hasChanges = true;
    }
    if (content.includes("`/api/v1")) {
        content = content.replace(/`\/api\/v1/g, "`/v1");
        hasChanges = true;
    }

    if (hasChanges) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
