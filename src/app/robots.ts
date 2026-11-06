import { site } from '@/config/site';
export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${site.domain}/sitemap.xml`}}
