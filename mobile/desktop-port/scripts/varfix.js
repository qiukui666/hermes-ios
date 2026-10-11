const fs = require('fs');
const { oklch } = require('culori');
let css = fs.readFileSync(process.argv[2], 'utf8');
css = css.replace(/oklch\(\s*([0-9.]+)%?\s+([0-9.]+)\s+([0-9.]+)(?:\/\s*([0-9.%]+))?\s*\)/g, (m, l, c, h, a) => {
  try {
    const col = oklch({ mode: 'oklch', l: parseFloat(l)/100, c: parseFloat(c), h: parseFloat(h) });
    if (!col) return m;
    const r = Math.round(col.r*255), g = Math.round(col.g*255), b = Math.round(col.b*255);
    return a !== undefined ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
  } catch { return m; }
});
fs.writeFileSync(process.argv[3], css);
console.log('remaining oklch:', (css.match(/oklch\(/g)||[]).length);
