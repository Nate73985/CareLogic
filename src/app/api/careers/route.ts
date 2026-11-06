import { submit } from '@/lib/submissions';
export const runtime='nodejs';
export async function POST(request:Request){return submit(request,'careers')}
