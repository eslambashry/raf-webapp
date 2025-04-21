'use client'

import Image from "next/image"
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowDownCircle } from 'lucide-react'
import Link from "next/link"

export default function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <section className="relative h-full w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background Video/Image Layer */}
        <div className="absolute inset-0">
          <Image
            src="/desk.jpg"
            alt="RAF Real Estate Development"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />

        {/* Main Content */}
        <div className="relative z-10 h-full container mx-auto px-4">
          <div className="h-full flex flex-col justify-center items-start max-w-4xl">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <Image
                src="/logo_3.png"
                alt="RAF Logo"
                width={200}
                height={100}
                className="object-contain"
              />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`text-6xl md:text-7xl font-bold text-white mb-6 ${isRTL ? 'font-arabic' : ''}`}
            >
              {t('hero.title')}
            </motion.h1>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 w-32 bg-gradient-to-r from-[#681034] via-[#d68c3c] to-[#681034] mb-6"
            />

            {/* Description */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mb-8"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                href="/projects" 
                className="px-8 py-3 bg-[#1D0728]  text-white rounded-lg transition-all duration-300 text-lg"
              >
                {t('hero.exploreProjects')}
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-[#C48765]  text-white rounded-lg transition-all duration-300 text-lg"
              >
                {t('hero.contactUs')}
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDownCircle className="w-10 h-10 text-white opacity-80" />
          </motion.div>
        </div>

        {/* Side Pattern */}
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#681034]/10 to-transparent" />

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="h-1 bg-gradient-to-r from-[#681034] via-[#d68c3c] to-[#681034]" />
          <div className="h-20 bg-gradient-to-t from-[#540f6b] to-transparent" />
        </div>
      </section>
    </div>
  )
}
