import { site } from '@/config/site';
import { services } from '@/config/services';
export default function sitemap(){return ['/','/about','/services','/careers','/contact','/privacy-policy',...services.map(s=>`/services/${s.slug}`)].map(path=>({url:site.domain+path}))}
