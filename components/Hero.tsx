'use client'

import Image from "next/image"
import { useTranslations, useLocale } from 'next-intl'

export default function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div style={{  height: '450px' }}>
      <section className="relative h-full w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/raf banner.png"
            alt="RAF Real Estate Development"
            fill
            className="object-cover"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* <div className="absolute inset-0 bg-black/50" /> */}
        </div>

        {/* Content */}
        {/* <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4">راف المتطوره</h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#681034] to-[#d68c3c]" />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl font-light mb-6">{t('hero.title')}</h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              {t('hero.description')}
            </p>
          </motion.div>
        </div> */}

        {/* Decorative gradient line at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#681034] via-[#d68c3c] to-[#681034]" />
      </section>
    </div>
  )
}
