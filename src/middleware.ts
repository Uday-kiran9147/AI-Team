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

  // If Clerk keys are configured, enforce authentication on private routes
  if (hasClerkKeys && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
