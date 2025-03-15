'use client'

import { useTranslations, useLocale } from 'next-intl'
import VideoShowcase from './VideoShowcase'

export default function VideoSection() {
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('videoSection.title', { default: 'مشاريعنا' })}</h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#681034] to-[#d68c3c]" />
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            {t('videoSection.description', { default: 'شاهد أحدث مشاريعنا العقارية بتقنية الفيديو عالي الجودة' })}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <VideoShowcase 
            src="/video.mp4" 
            title={t('videoSection.videoTitle', { default: 'مشروع راف المتطورة الجديد' })}
            description={t('videoSection.videoDescription', { default: 'استمتع بمشاهدة تفاصيل المشروع بجودة عالية وتصميم فريد يعكس رؤيتنا المستقبلية للتطوير العقاري' })}
          />
        </div>
      </div>
    </section>
  )
}
