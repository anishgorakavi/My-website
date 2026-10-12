import {createRequire} from 'node:module';
const require=createRequire('/Users/anishgorakavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const sharp=require('sharp');
import fs from 'node:fs/promises';
const results=[];
for(const width of [390,820,1440]){
 const a=await sharp(`tmp/refactor/before-${width}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const b=await sharp(`tmp/refactor/after-${width}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let changed=0;for(let i=0;i<a.data.length;i+=4)if(a.data.subarray(i,i+4).compare(b.data.subarray(i,i+4))!==0)changed++;
 results.push({width,height:a.info.height,dimensionsMatch:JSON.stringify(a.info)===JSON.stringify(b.info),changedPixels:changed,totalPixels:a.info.width*a.info.height});
 const images=await Promise.all(['before','after'].map(kind=>sharp(`tmp/refactor/${kind}-${width}.png`).resize({width:420}).toBuffer({resolveWithObject:true})));
 await sharp({create:{width:840,height:Math.max(...images.map(i=>i.info.height)),channels:3,background:'#080c13'}}).composite(images.map((i,n)=>({input:i.data,left:n*420,top:0}))).png().toFile(`tmp/refactor/comparison-${width}.png`);
}
await fs.writeFile('tmp/refactor/pixel-comparison.json',JSON.stringify(results,null,2));console.log(results);
