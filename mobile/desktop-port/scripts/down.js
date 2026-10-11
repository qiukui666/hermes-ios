const lightningcss = require('lightningcss');
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const { code } = lightningcss.transform({
  filename: 'index.css',
  code: Buffer.from(src),
  minify: true,
  targets: { safari: (16 << 16) | (4 << 8), ios_saf: (16 << 16) | (4 << 8) },
  errorRecovery: true,
});
fs.writeFileSync(process.argv[3], code);
console.log('done', code.length);
