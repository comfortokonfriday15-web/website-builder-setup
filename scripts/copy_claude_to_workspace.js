const fs = require('fs');
const path = require('path');
const src = process.env.USERPROFILE + '\\.claude.json';
const dest = path.join(__dirname, 'claude.json.copy');
try{
  if(!fs.existsSync(src)) { console.error('Source not found:', src); process.exit(2); }
  fs.copyFileSync(src, dest);
  console.log('copied to', dest);
}catch(e){console.error(e);process.exit(1);}