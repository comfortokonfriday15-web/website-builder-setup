const fs = require('fs');
const p = process.env.USERPROFILE + '\\.claude.json';
try{
  if(!fs.existsSync(p)) { console.error('File not found:', p); process.exit(2); }
  const j = JSON.parse(fs.readFileSync(p,'utf8'));
  console.log('mcpServers keys:', Object.keys(j.mcpServers||{}));
}catch(e){console.error(e);process.exit(1);}