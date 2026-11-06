import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
const root=process.cwd();
const stage=resolve(root,'.pages-build');
const output=resolve(root,'out');
// Only these fixed, workspace-local build directories may be cleaned.
for(const target of [stage,output]){
 if(relative(root,target).startsWith('..')||!relative(root,target)||relative(root,target).includes(sep)) throw new Error('Unexpected build directory');
 rmSync(target,{recursive:true,force:true});
}
mkdirSync(stage,{recursive:true});
for(const name of ['src','public','package.json','tsconfig.json','next-env.d.ts','next.config.ts','postcss.config.mjs']){
 if(existsSync(resolve(root,name))) cpSync(resolve(root,name),resolve(stage,name),{recursive:true,filter:path=>path!==resolve(root,'src/app/api')});
}
const result=spawnSync(process.execPath,[resolve(root,'node_modules/next/dist/bin/next'),'build',stage,'--webpack'],{
 stdio:'inherit',env:{...process.env,GITHUB_PAGES:'true',NEXT_PUBLIC_BASE_PATH:'/CareLogic',NEXT_PUBLIC_SITE_URL:'https://nate73985.github.io/CareLogic',NEXT_TELEMETRY_DISABLED:'1'},
});
if(result.status!==0)process.exit(result.status||1);
cpSync(resolve(stage,'out'),output,{recursive:true});
writeFileSync(resolve(output,'.nojekyll'),'');
// Pages cannot send HTTP redirects. Provide useful static migration pages instead.
for(const [from,to] of Object.entries({'transportation':'services','services/transportation':'services','about-us':'about','contact-us':'contact','our-services':'services','services/staffing-solutions':'services/staffing-solution'})){
 const folder=resolve(output,from);mkdirSync(folder,{recursive:true});
 const href=`/CareLogic/${to}/`;
 writeFileSync(resolve(folder,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page moved | CareLogic</title><meta http-equiv="refresh" content="0;url=${href}"><link rel="canonical" href="https://nate73985.github.io${href}"></head><body><p>This page has moved. <a href="${href}">Continue to CareLogic</a>.</p></body></html>`);
}
console.log('GitHub Pages export ready in out/. Server endpoints are excluded; careers uses direct contact.');
