import createMiddleware from 'next-intl/middleware';
import { locales } from './config/i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to static files and assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/public') || 
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return intlMiddleware(request);
  }
  
  // Check if the user is already on a maintenance page
  if (pathname.includes('/')) {
    return intlMiddleware(request);
  }
  
  // Redirect to maintenance page with the correct locale
  const locale = pathname.startsWith('/en') ? 'en' : 'ar';
  const url = new URL(`/${locale}/`, request.url);
  
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};