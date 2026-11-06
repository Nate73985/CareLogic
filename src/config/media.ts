// All image, logo and video references belong here. Public paths omit /public.
const stock = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;
export type MediaImage = { src: string; alt: string; position?: string; stock?: boolean };
export const media = {
  logo: { src: '', alt: 'CareLogic Health Services, LLC — Compassion in Every Touch.', width: 260, height: 76 },
  hero: { src: stock('photo-1576765608535-5f04d1e3f289'), alt: 'Care professional offering attentive support to an older adult', position: 'center', stock: true },
  about: { src: stock('photo-1584515933487-779824d29309'), alt: 'Healthcare professional listening with care', stock: true },
  services: {
    'skilled-nursing-care': { src: stock('photo-1576091160399-112ba8d25d1d'), alt: 'Healthcare professionals reviewing a care plan', stock: true },
    'home-health-care': { src: stock('photo-1576765608535-5f04d1e3f289'), alt: 'An older adult receiving attentive personal support', stock: true },
    'occupational-therapy': { src: stock('photo-1576091160550-2173dba999ef'), alt: 'A care professional discussing individual support', stock: true },
    'adult-foster-care': { src: stock('photo-1516302752625-fcc3c50ae61f'), alt: 'Warm connection between older adults', stock: true },
    'physical-therapy': { src: stock('photo-1571019613454-1cb2f99b2d8b'), alt: 'Guided movement and physical exercise', stock: true },
    'staffing-solution': { src: stock('photo-1559839734-2b71ea197ec2'), alt: 'A healthcare professional in a clinical setting', stock: true },
  },
  video: { src: '', poster: { src: stock('photo-1576765608535-5f04d1e3f289'), alt: 'Illustrative scene of compassionate support', stock: true }, captions: '', captionLanguage: 'en' },
  fallback: { src: '/images/media-fallback.svg', alt: 'CareLogic — compassionate care at home' },
} satisfies { logo: {src: string; alt: string; width: number; height: number}; hero: MediaImage; about: MediaImage; services: Record<string, MediaImage>; video: {src: string; poster: MediaImage; captions: string; captionLanguage: string}; fallback: MediaImage };
