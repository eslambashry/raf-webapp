'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

const statistics = [
  { 
    key: 'landArea', 
    number: 888,
    icon: '/icons/area-icon.svg',
    gradient: 'from-[#34222E]/20 to-[#34222E]/5'
  },
  { 
    key: 'projects', 
    number: 100,
    icon: '/icons/project-icon.svg',
    gradient: 'from-[#34222E]/15 to-[#34222E]/5'
  },
  { 
    key: 'housingUnits', 
    number: 8788,
    icon: '/icons/house-icon.svg',
    gradient: 'from-[#34222E]/10 to-[#34222E]/5'
  },
  { 
    key: 'totalArea', 
    number: 98787,
    icon: '/icons/measure-icon.svg',
    gradient: 'from-[#34222E]/5 to-[#34222E]/5'
  }
];

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <motion.span
      ref={countRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-bold"
    >
      {count.toLocaleString()}
    </motion.span>
  );
};

export default function AboutUs() {
  const t = useTranslations('about');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="relative py-24 bg-[#EFEDEA]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* RAF Brand Watermark */}
<motion.div 
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  className="absolute top-0 right-0 -translate-y-1/3 pointer-events-none"
>
  <span className="text-[25rem] font-black text-[#34222E]/[0.02] leading-none select-none">
    RAF
  </span>
</motion.div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-2 bg-[#34222E]/5 rounded-full text-sm font-medium text-[#34222E]">
              {t('subtitle')}
            </span>
            
            <h2 className="text-5xl font-bold text-[#34222E] leading-tight">
              {t('title')}
            </h2>
            
            <div className="w-24 h-1 bg-[#34222E]" />
            
            <p className="text-xl text-[#34222E]/70 leading-relaxed">
              {t('description')}
            </p>


            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#34222E] text-[#EFEDEA] rounded-full
                       text-lg font-medium hover:bg-[#34222E]/90 transition-colors"
            >
              {t('learnMore')}
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Column - Image & Stats */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="/about.png"
                  alt={t('imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#34222E]/20 to-transparent" />
              </div>

              {/* Floating Elements */}
              <div className="absolute -z-10 -bottom-8 -right-8 w-64 h-64 rounded-full bg-[#34222E]/5 blur-3xl" />
            </motion.div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-6">
              {statistics.map((stat, index) => (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 rounded-2xl bg-gradient-to-br border border-[#34222E]/10
                           hover:border-[#34222E]/20 transition-all duration-500 group"
                >
                  <div className="relative z-10">
                    <div className="flex items-baseline gap-1 text-4xl font-bold text-[#34222E] mb-2">
                      <AnimatedCounter end={stat.number} />
                      <span className="text-[#34222E]/60">+</span>
                    </div>
                    <p className="text-[#34222E]/70">
                      {t(`statistics.${stat.key}`)}
                    </p>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-[#34222E]/5 to-transparent 
                                rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#34222E]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#34222E]/5 rounded-full blur-3xl -z-10" />
      
    </section>
  );
}
