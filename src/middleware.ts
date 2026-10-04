import { NextResponse, type NextRequest } from 'next/server';

// Auth middleware commented out for pure landing page mode
/*
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/home(.*)',
  '/products(.*)',
  '/api/products(.*)',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secKey = process.env.CLERK_SECRET_KEY;
  const hasClerkKeys =
    Boolean(pubKey) &&
    Boolean(secKey) &&
    Boolean(pubKey?.startsWith('pk_')) &&
    !pubKey?.includes('your_clerk_publishable_key');

  if (hasClerkKeys && !isPublicRoute(req)) {
    await auth.protect();
  }
});
*/

export default function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
