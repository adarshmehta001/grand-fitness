const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  require.resolve('@babel/preset-env');
} catch (e) {
  console.log("Installing @babel/preset-env...");
  execSync('npm i --no-save @babel/preset-env', { stdio: 'inherit' });
}

const babel = require('@babel/core');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === 'dist' || f.startsWith('.')) return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    const code = fs.readFileSync(filePath, 'utf-8');
    if (!code.includes('import ') && !code.includes('export ')) return;
    
    try {
      const result = babel.transformSync(code, {
        filename: filePath,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }]
        ]
      });

      fs.writeFileSync(filePath, result.code);
      console.log(`Converted to CommonJS: ${filePath}`);
    } catch (e) {
      console.error(`Failed to convert ${filePath}:`, e.message);
    }
  }
}

console.log("Converting backend to CommonJS...");
walk(path.join(__dirname, 'backend'), processFile);
console.log("Done.");
