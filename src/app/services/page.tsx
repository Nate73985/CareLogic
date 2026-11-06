import { CTA, Highlights, PageHero } from '@/components/content';
import { Button, Photo } from '@/components/ui';
import { services } from '@/config/services';
import { media } from '@/config/media';
export const metadata={title:'Our Services',description:'Explore six services designed around individuals, families, and healthcare organizations.',alternates:{canonical:'/services'}};
export default function Services(){return <><PageHero eyebrow="Care, thoughtfully considered" title="Our Services" description="Comprehensive, compassionate support designed around the needs of individuals and families."/>{services.map((s,i)=><section className={`section split service-feature ${i%2?'reverse':''}`} key={s.slug}><Photo asset={media.services[s.slug]}/><div><p className="eyebrow">0{i+1} / Personalized support</p><h2>{s.name}</h2><p>{s.description}</p><Highlights service={s}/><Button href={`/services/${s.slug}`}>Learn More</Button></div></section>)}<CTA/></>}
