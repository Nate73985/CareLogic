// Run against a local production server without credentials. Does not send email.
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:3001';
const routes=['/','/about','/services','/careers','/contact','/privacy-policy','/services/skilled-nursing-care','/services/home-health-care','/services/occupational-therapy','/services/adult-foster-care','/services/physical-therapy','/services/staffing-solution','/sitemap.xml','/robots.txt','/images/media-fallback.svg'];
for(const path of routes){const r=await fetch(base+path);assert.equal(r.status,200,path);if(!path.includes('.')){const html=await r.text();assert.ok(html.includes('<h1'),`Heading: ${path}`);assert.ok(r.headers.get('content-security-policy'),`CSP: ${path}`)}}
for(const path of ['/transportation','/about-us','/contact-us']){const r=await fetch(base+path,{redirect:'manual'});assert.ok([301,308].includes(r.status),path);assert.ok(r.headers.get('location'))}
assert.equal((await fetch(base+'/not-a-page')).status,404);
assert.equal((await fetch(`${base}/api/contact`,{method:'POST'})).status,410);
for(const kind of ['careers']){
 const wrong=await fetch(`${base}/api/${kind}`,{method:'POST',headers:{origin:'https://other.example'}});assert.equal(wrong.status,403);
 const unconfigured=await fetch(`${base}/api/${kind}`,{method:'POST',headers:{origin:'https://carelogichealth.com'}});assert.equal(unconfigured.status,503);assert.match((await unconfigured.json()).message,/not been sent/);
}
console.log(`PASS: ${routes.length} routes, redirects, 404, headers, origin rejection, and honest unconfigured-form responses.`);
