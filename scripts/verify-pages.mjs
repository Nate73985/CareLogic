import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out');
const routes=['','about','services','careers','contact','privacy-policy','services/skilled-nursing-care','services/home-health-care','services/occupational-therapy','services/adult-foster-care','services/physical-therapy','services/staffing-solution'];
for(const route of routes){const html=readFileSync(join(root,route,'index.html'),'utf8');assert.match(html,/<h1/);for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){
 const path=match[1];assert.ok(path.startsWith('/CareLogic/'),`Missing project base path: ${path}`);
 const local=join(root,decodeURIComponent(path.slice('/CareLogic/'.length)));
 assert.ok(existsSync(local)||existsSync(join(local,'index.html')),`Missing local resource: ${path}`);
}}
const careers=readFileSync(join(root,'careers/index.html'),'utf8');assert.ok(!careers.includes('<form'),'Static careers form must be disabled');
assert.ok(!existsSync(join(root,'api')),'No server endpoints in static export');
assert.ok(existsSync(join(root,'.nojekyll')));
assert.match(readFileSync(join(root,'sitemap.xml'),'utf8'),/https:\/\/nate73985.github.io\/CareLogic/);
console.log(`PASS: ${routes.length} static pages, navigation and asset paths, careers fallback, sitemap, and API exclusion.`);
