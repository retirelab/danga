// Build only. Copy the finished public/ folder to NAS; Node is not needed on NAS.
const fs=require('fs');
const path=require('path');
const babel=require(process.argv[2] || '/tmp/danga-babel.min.js');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app.jsx'),'utf8');
fs.writeFileSync(path.join(root,'public/app.js'),babel.transform(source,{presets:['react'],comments:false}).code);
