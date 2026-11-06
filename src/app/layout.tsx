import type { Metadata } from 'next';
import { Header } from '@/components/ui';
import { Footer } from '@/components/content';
import { site } from '@/config/site';
import './globals.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
export const metadata:Metadata={metadataBase:new URL(site.domain),title:{default:'CareLogic Health | Compassion in Every Touch',template:'%s | CareLogic Health'},description:'Compassionate home healthcare, therapy, adult foster care, and healthcare staffing. Personalized support centered on dignity and independence.',openGraph:{siteName:site.companyName,type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main">{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.companyName,url:site.domain,email:site.email})}}/></body></html>}
