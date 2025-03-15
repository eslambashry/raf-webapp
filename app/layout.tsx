import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://raf-advanced.sa'),
  title: {
    default: 'راف المتقدمة | تطوير عقاري متميز في المملكة العربية السعودية',
    template: '%s | راف المتقدمة'
  },
  description: 'راف المتقدمة - شركة رائدة في التطوير العقاري في المملكة العربية السعودية، نقدم مشاريع سكنية فاخرة وشقق عصرية وعقارات متميزة في مواقع استراتيجية',
  keywords: [
    'عقارات السعودية',
    'عقارات فاخرة الرياض',
    'مشاريع سكنية',
    'شقق فاخرة السعودية',
    'تطوير عقاري الرياض',
    'منازل عصرية السعودية',
    'استثمار عقاري',
    'عقارات راف المتقدمة',
    'عقارات فاخرة',
    'إسكان متميز الرياض'
  ],
  authors: [{ name: 'راف المتقدمة' }],
  creator: 'راف المتقدمة',
  publisher: 'راف المتقدمة',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'راف المتقدمة | تطوير عقاري متميز',
    description: 'اكتشف المشاريع السكنية الفاخرة والعقارات المتميزة في المملكة العربية السعودية مع راف المتقدمة',
    url: 'https://raf-advanced.sa',
    siteName: 'راف المتقدمة',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'عقارات راف المتقدمة',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'راف المتقدمة | تطوير عقاري متميز',
    description: 'مشاريع سكنية فاخرة وعقارات متميزة في المملكة العربية السعودية',
    images: ['/twitter-image.jpg'],
    creator: '@raf_advanced',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo1.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#34222E" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MGMC6KSC');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGMC6KSC"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}