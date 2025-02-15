'use client'

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function Hero() {
  const t = useTranslations()

  return (
    <section className="relative min-h-screen bg-basic overflow-hidden">
      {/* Architectural Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="grid lg:grid-cols-12 min-h-screen">
        {/* Content Column */}
        <motion.div 
          className="lg:col-span-6 relative z-20 flex items-center px-8 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative">
            {/* RAF Logo/Brand Element */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <span className="text-8xl font-black text-primary/10 absolute -top-20 -left-4">RAF</span>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-primary mb-2">{t('hero.title')}</span>
                  <span className="block text-secondary relative">
                    {t('hero.subtitle')}
                    <svg className="absolute -right-12 top-1/2 w-8 h-8 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22l-4-4h8l-4 4z" />
                    </svg>
                  </span>
                </h1>
              </motion.div>

              <motion.p 
                className="text-xl lg:text-2xl text-primary/80 leading-relaxed"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t('hero.description')}
              </motion.p>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-6"
              >

                
                <Link
                  href="/projects"
                  className="
                    inline-flex items-center
                    text-primary
                    px-8 py-4
                    text-lg font-medium
                    hover:text-secondary
                    transition-colors
                  "
                >
                  مشاريعنا
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Image Column */}
        <div className="lg:col-span-6 relative">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src="/image1.png"
              alt="Modern building"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={100}
            />
            {/* Modern Overlay Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(32,39,71,0.1)_25%,transparent_25%,transparent_50%,rgba(32,39,71,0.1)_50%,rgba(32,39,71,0.1)_75%,transparent_75%,transparent)] bg-[length:24px_24px]" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <motion.div 
        className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/5 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </section>
  )
}
