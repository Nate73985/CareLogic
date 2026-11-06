import { randomUUID, createHash } from 'node:crypto';
import { z } from 'zod';
import { site } from '@/config/site';
import { services } from '@/config/services';
const text=z.string().trim().max(200);
const common=z.object({name:text.min(2),email:z.email().max(200),phone:text.min(7),consent:z.literal('yes'),message:z.string().trim().max(4000),website:z.literal('')});
const contact=common.extend({service:z.enum(['General inquiry',...services.map(s=>s.name)]),message:z.string().trim().min(5).max(4000)});
const careers=common.extend({city:text.min(1),state:text.min(1),zip:text.min(3),address:text,credential:text,shifts:z.enum(['Days','Evenings','Nights','Weekends','Flexible / discuss with team']),source:text,experience:z.string().trim().min(1).max(4000)});
const json=(message:string,status=200)=>Response.json({message},{status});
async function boundedBody(request:Request){const reader=request.body?.getReader();if(!reader)throw new Error('body');let size=0;const chunks:Uint8Array[]=[];while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>6*1024*1024){await reader.cancel();throw new Error('size')}chunks.push(value)}const bytes=Buffer.concat(chunks);return new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('content-type')||''},body:bytes}).formData()}
async function limited(request:Request,kind:string){const address=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||request.headers.get('x-real-ip')||'unknown';const key=`carelogic:${kind}:${createHash('sha256').update(address).digest('hex')}`;const response=await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`,{method:'POST',headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify([['INCR',key],['EXPIRE',key,3600,'NX']]),signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('rate');const data=await response.json();if(data.some((r:{error?:string})=>r.error))throw new Error('rate');return Number(data[0]?.result)<=5}
async function storage(path:string,init:RequestInit){const r=await fetch(`${process.env.SUPABASE_URL}/storage/v1/${path}`,{...init,headers:{Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,apikey:process.env.SUPABASE_SERVICE_ROLE_KEY!,...init.headers},signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('storage');return r}
export async function submit(request:Request,kind:'contact'|'careers'){
 const origin=request.headers.get('origin');const allowed=new URL(process.env.SITE_URL||site.domain).origin;
 if(origin!==allowed)return json('Please submit this form from the CareLogic website.',403);
 const required=['RESEND_API_KEY','MAIL_FROM','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN',...(kind==='careers'?['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY']:[])];
 if(required.some(key=>!process.env[key]))return json('Online submissions are not available yet. Please contact info@carelogichealth.com for an appropriate way to continue. Your information has not been sent.',503);
 if(Number(request.headers.get('content-length')||0)>6*1024*1024)return json('Your upload is too large. Resume limit: 4 MB.',413);
 let objectPath='';
 try{
   if(!await limited(request,kind))return json('Too many attempts. Please try again in an hour.',429);
   let data:FormData;try{data=await boundedBody(request)}catch{return json('Unable to read this submission. Check the file size and try again.',400)}
   const fields=Object.fromEntries([...data.entries()].filter(([,value])=>typeof value==='string'));
   const parsed=(kind==='careers'?careers:contact).safeParse(fields);
   if(!parsed.success)return json('Please check all required fields and keep messages under 4,000 characters.',400);
   let resumeLink='';
   if(kind==='careers'){
     const file=data.get('resume');if(!(file instanceof File)||file.size===0||file.size>4*1024*1024)return json('Please upload a PDF, DOC, or DOCX resume of up to 4 MB.',400);
     const ext=file.name.split('.').pop()?.toLowerCase();const types:Record<string,string>={pdf:'application/pdf',doc:'application/msword',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
     if(!ext||!types[ext]||file.type!==types[ext])return json('The resume filename and file type must match PDF, DOC, or DOCX.',400);
     const bytes=Buffer.from(await file.arrayBuffer());
     const valid=ext==='pdf'?bytes.subarray(0,5).toString()==='%PDF-':ext==='doc'?bytes.subarray(0,8).equals(Buffer.from('d0cf11e0a1b11ae1','hex')):bytes.subarray(0,4).equals(Buffer.from('504b0304','hex'))&&bytes.includes(Buffer.from('word/'))&&bytes.includes(Buffer.from('[Content_Types].xml'));
     if(!valid)return json('The resume content does not match the selected file type.',400);
     objectPath=`${new Date().toISOString().slice(0,10)}/${randomUUID()}.${ext}`;
     await storage(`object/resumes/${objectPath}`,{method:'POST',headers:{'Content-Type':types[ext],'x-upsert':'false'},body:bytes});
     const signed=await storage(`object/sign/resumes/${objectPath}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})});const payload=await signed.json();
     if(!payload.signedURL)throw new Error('sign');resumeLink=`${process.env.SUPABASE_URL}/storage/v1${payload.signedURL}`;
   }
   const content=Object.entries(parsed.data).filter(([key])=>!['website','consent'].includes(key)).map(([key,value])=>`${key}: ${value}`).join('\n\n');
   const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.MAIL_FROM,to:[site.email],reply_to:parsed.data.email,subject:kind==='careers'?'CareLogic career application':'CareLogic website inquiry',text:`${content}${resumeLink?`\n\nPrivate resume link (expires in one hour): ${resumeLink}\nIf expired, authorized staff can retrieve it from the private resumes bucket. Object: ${objectPath}`:''}`}),signal:AbortSignal.timeout(15000)});
   if(!result.ok)throw new Error('email');
   return json('Thank you. Your submission has been accepted by our email provider. Our team will review it.');
 }catch{
   if(objectPath){try{await storage('object/resumes',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({prefixes:[objectPath]})})}catch{/* Operations should reconcile orphaned uploads through scheduled retention. */}}
   return json('We could not complete your submission. Please try again later or contact our team. If you already submitted, check with us before retrying.',502);
 }
}


