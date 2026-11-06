import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  async redirects() { return [
    { source:'/transportation', destination:'/services', statusCode:301 },
    { source:'/services/transportation', destination:'/services', statusCode:301 },
    { source:'/about-us', destination:'/about', statusCode:301 },
    { source:'/contact-us', destination:'/contact', statusCode:301 },
    { source:'/our-services', destination:'/services', statusCode:301 },
    { source:'/services/staffing-solutions', destination:'/services/staffing-solution', statusCode:301 },
  ]; },
  async headers() { return [{source:'/(.*)',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    {key:'Content-Security-Policy',value:"default-src 'self'; img-src 'self' https://images.unsplash.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; media-src 'self'; connect-src 'self'; frame-src https://maps.google.com https://www.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"},
  ]}]; },
};
export default config;


