'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from 'next-intl';
import ClientOnly from "./ClientOnly";

const features = [
  { title: { ar: "قريب من جميع الخدمات", en: "Close to All Services" }, icon: "/service.svg", description: { ar: "موقع استراتيجي يتيح الوصول السهل لجميع الخدمات", en: "Strategic location allowing easy access to all services" } },
  { title: { ar: "مدخل وخزانات وعدادات وصكوك مستقلة", en: "Independent Entrance & Utilities" }, icon: "/upgrade.svg", description: { ar: "استقلالية كاملة في المرافق والخدمات", en: "Complete independence in facilities and services" } },
  { title: { ar: "كراج سيارة", en: "Car Garage" }, icon: "/TaxiRank.svg", description: { ar: "مساحة آمنة لركن السيارات", en: "Secure parking space" } },
  { title: { ar: "حدائق جانبية", en: "Side Gardens" }, icon: "/ParkBench.svg", description: { ar: "مساحات خضراء جميلة", en: "Beautiful green spaces" } },
  { title: { ar: "إشراف الأعمال من قبل مهندسين معتمدين", en: "Professional Engineering Supervision" }, icon: "/engineer.svg", description: { ar: "إشراف هندسي عالي الجودة", en: "High-quality engineering supervision" } },
  { title: { ar: "مصعد راكب للدور العلوي", en: "Modern Passenger Elevator" }, icon: "/elevator.svg", description: { ar: "مصاعد حديثة وآمنة", en: "Modern and safe elevators" } },
];

export default function FeatureSection() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <ClientOnly>
      <section className="relative w-full py-32 bg-gradient-to-b from-white to-[#EFEDEA] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 max-w-7xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#C48765] text-sm font-semibold tracking-wider uppercase mb-4 block">
              {isRTL ? 'مميزات متكاملة' : 'Comprehensive Features'}
            </span>
            <h2 className={`text-4xl lg:text-6xl font-bold ${isRTL ? 'font-cairo' : 'font-sans'} 
                           bg-gradient-to-r from-[#34222E] via-[#8B4F3D] to-[#C48765] bg-clip-text text-transparent
                           max-w-3xl mx-auto leading-tight`}>
              {isRTL ? 'مميزات شركة تاسيس البناء للتطوير العقاري' : 'Features of Tasees Al-Bina Real Estate'}
            </h2>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`h-full bg-[#EFEDEA]/80 backdrop-blur-sm rounded-3xl p-8
                                border border-[#34222E]/10 hover:border-[#C48765]
                                transform hover:-translate-y-1 transition-all duration-300
                                hover:shadow-[0_20px_50px_rgba(196,135,101,0.1)]
                                ${isRTL ? 'rtl' : 'ltr'}`}>
                  
                  {/* Icon Container */}
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C48765]/20 to-[#34222E]/20 rounded-2xl 
                                  transform rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="relative w-full h-full bg-[#34222E] rounded-2xl p-3 shadow-lg">
                      <Image
                        src={feature.icon}
                        alt={isRTL ? feature.title.ar : feature.title.en}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className={`text-[#34222E] text-xl font-bold mb-3
                                 group-hover:text-[#C48765] transition-colors duration-300`}>
                    {isRTL ? feature.title.ar : feature.title.en}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {isRTL ? feature.description.ar : feature.description.en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#C48765]/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-20 left-0 w-[30rem] h-[30rem] bg-[#34222E]/10 rounded-full blur-[120px] -z-10" />
        </motion.div>
      </section>
    </ClientOnly>
  );
}
