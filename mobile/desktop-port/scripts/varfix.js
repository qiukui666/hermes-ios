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

// Relative color syntax (oklch(from currentColor ...)) aborts iOS 16.4 WebKit
// even inside var() fallbacks. Replace with a plain translucent color.
css = css.replace(/oklch\(from currentColor[^)]*\)/g, "rgba(128, 128, 128, 0.35)");


// color-mix(in oklch, ...) aborts iOS 16.4 WebKit (bad_variant_access) even
// inside @supports blocks. Replace the oklch interpolation space with srgb.
css = css.replace(/color-mix\(in oklch/g, "color-mix(in srgb");

fs.writeFileSync(process.argv[3], css);
console.log('remaining oklch:', (css.match(/oklch\(/g)||[]).length);
