// 'use client';
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { useLocale } from 'next-intl';
// import ClientOnly from "./ClientOnly";

// const features = [
//   { title: { ar: "قريب من جميع الخدمات", en: "Close to All Services" }, icon: "/Service.svg", description: { ar: "موقع استراتيجي يتيح الوصول السهل لجميع الخدمات", en: "Strategic location allowing easy access to all services" } },
//   { title: { ar: "مدخل وخزانات وعدادات وصكوك مستقلة", en: "Independent Entrance & Utilities" }, icon: "/Upgrade.svg", description: { ar: "استقلالية كاملة في المشركة راف ق والخدمات", en: "Complete independence in facilities and services" } },
//   { title: { ar: "كراج سيارة", en: "Car Garage" }, icon: "/TaxiRank.svg", description: { ar: "مساحة آمنة لركن السيارات", en: "Secure parking space" } },
//   { title: { ar: "حدائق جانبية", en: "Side Gardens" }, icon: "/ParkBench.svg", description: { ar: "مساحات خضراء جميلة", en: "Beautiful green spaces" } },
//   { title: { ar: "إشركة راف  الأعمال من قبل مهندسين معتمدين", en: "Professional Engineering Supervision" }, icon: "/Engineer.svg", description: { ar: "إششركة راف  هندسي عالي الجودة", en: "High-quality engineering supervision" } },
//   { title: { ar: "مصعد راكب للدور العلوي", en: "Modern Passenger Elevator" }, icon: "/Elevator.svg", description: { ar: "مصاعد حديثة وآمنة", en: "Modern and safe elevators" } },
// ];

// export default function FeatureSection() {
//   const locale = useLocale();
//   const isRTL = locale === 'ar';

//   return (
//     <ClientOnly>
//       <section className="relative w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[#EFEDEA] overflow-hidden">
//         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl"
//           dir={isRTL ? 'rtl' : 'ltr'}
//         >
//           {/* Header - Responsive Typography */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-24"
//           >
//             <span className="text-[#C48765] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2 sm:mb-3 md:mb-4 block">
//               {isRTL ? 'مميزات متكاملة' : 'Comprehensive Features'}
//             </span>
//             <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold 
//                            ${isRTL ? 'font-cairo' : 'font-sans'} 
//                            bg-[#34222E] 
//                            bg-clip-text text-transparent max-w-3xl mx-auto leading-tight
//                            px-2 sm:px-4 py-1 sm:py-2 md:py-3 lg:py-4`}>
//               {isRTL ? 'مميزات شركة راف للتطوير العقاري' : 'Features of RAF Advanced Real Estate'}
//             </h2>
//           </motion.div>

//           {/* Features Grid - Always 2 columns on mobile */}
//           <div className="grid grid-cols-2 auto-rows-fr gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 relative">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ 
//                   duration: 0.5, 
//                   delay: Math.floor(index / 2) * 0.2
//                 }}
//                 style={{
//                   gridRow: `${Math.floor(index / 2) + 1}`,
//                   height: '100%'
//                 }}
//                 className="group"
//               >
//                 <div className={`h-full bg-[#EFEDEA]/80 backdrop-blur-sm 
//                                 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl 
//                                 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8
//                                 border border-[#34222E]/10 hover:border-[#C48765]
//                                 transform hover:-translate-y-1 transition-all duration-300
//                                 hover:shadow-[0_20px_50px_rgba(196,135,101,0.1)]
//                                 ${isRTL ? 'text-right' : 'text-left'}`}
//                 >
//                   {/* Icon Container - Responsive Sizing */}
//                   <div className="relative w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 
//                                 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6">
//                     <div className="absolute inset-0 bg-gradient-to-br from-[#C48765]/20 to-[#34222E]/20 
//                                   rounded-lg sm:rounded-xl md:rounded-2xl
//                                   transform rotate-6 group-hover:rotate-12 transition-transform duration-300" />
//                     <div className="relative w-full h-full bg-[#34222E] rounded-lg sm:rounded-xl md:rounded-2xl 
//                                   p-1.5 xs:p-2 sm:p-2.5 md:p-3 shadow-lg">
//                       <Image
//                         src={feature.icon}
//                         alt={isRTL ? feature.title.ar : feature.title.en}
//                         fill
//                         className="object-contain p-1 xs:p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
//                       />
//                     </div>
//                   </div>
                  
//                   {/* Content - Responsive Typography */}
//                   <h3 className={`text-[#34222E] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl 
//                                  font-bold mb-1 xs:mb-1.5 sm:mb-2 md:mb-3
//                                  group-hover:text-[#C48765] transition-colors duration-300
//                                  line-clamp-2`}>
//                     {isRTL ? feature.title.ar : feature.title.en}
//                   </h3>
//                   <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm md:text-base 
//                                leading-relaxed line-clamp-2 xs:line-clamp-3 sm:line-clamp-4">
//                     {isRTL ? feature.description.ar : feature.description.en}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Decorative Elements - Responsive Sizing */}
//           <div className={`absolute top-20 ${isRTL ? 'left-0' : 'right-0'} 
//                         w-48 sm:w-64 md:w-80 lg:w-96 
//                         h-48 sm:h-64 md:h-80 lg:h-96 
//                         bg-[#C48765]/10 rounded-full blur-[50px] sm:blur-[75px] md:blur-[100px] -z-10`} />
//           <div className={`absolute bottom-20 ${isRTL ? 'right-0' : 'left-0'} 
//                         w-60 sm:w-80 md:w-96 lg:w-[30rem] 
//                         h-60 sm:h-80 md:h-96 lg:h-[30rem] 
//                         bg-[#34222E]/10 rounded-full blur-[60px] sm:blur-[90px] md:blur-[120px] -z-10`} />
//         </motion.div>
//       </section>
//     </ClientOnly>
//   );
// }

'use client';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2, Crown, Gem, Star } from 'lucide-react';

const exclusiveFeatures = [
  {
    icon: Crown,
    imageUrl: '/hero_2.jpg',
    ar: {
      title: 'تصاميم عصرية',
      description: 'وحدات سكنية بتصاميم راقية تجمع بين الأصالة والحداثة',
      features: ['مساحات واسعة', 'إضاءة طبيعية', 'تشطيبات فاخرة']
    },
    en: {
      title: 'Modern Designs',
      description: 'Residential units with sophisticated designs combining authenticity and modernity',
      features: ['Spacious areas', 'Natural lighting', 'Luxury finishes']
    }
  },
  {
    icon: Building2,
    imageUrl: '/aboutPage.png',
    ar: {
      title: 'تقنيات ذكية',
      description: 'أنظمة منزلية متكاملة تمنحك تحكماً كاملاً في وحدتك السكنية',
      features: ['أنظمة أمان متطورة', 'تحكم ذكي', 'توفير الطاقة']
    },
    en: {
      title: 'Smart Technologies',
      description: 'Integrated home systems giving you complete control of your residential unit',
      features: ['Advanced security', 'Smart control', 'Energy saving']
    }
  },
  {
    icon: Gem,
    imageUrl: '/desk.jpg',
    ar: {
      title: 'مواقع استراتيجية',
      description: 'اختيار دقيق للمواقع يضمن لك سهولة الوصول لجميع الخدمات',
      features: ['قرب الخدمات', 'مداخل متعددة', 'إطلالات مميزة']
    },
    en: {
      title: 'Strategic Locations',
      description: 'Carefully selected locations ensuring easy access to all services',
      features: ['Near services', 'Multiple entrances', 'Premium views']
    }
  }
];

export default function ExclusiveFeatures() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="py-20 bg-gradient-to-b from-[#34222E] to-[#1a1114]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Star className="w-12 h-12 text-[#C48765] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {isRTL ? 'مميزات حصرية' : 'Exclusive Features'}
          </h2>
          <div className="w-24 h-1 bg-[#C48765] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {exclusiveFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-500">
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={feature.imageUrl}
                    alt={isRTL ? feature.ar.title : feature.en.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#34222E] to-transparent opacity-60" />
                  <feature.icon className="absolute bottom-4 right-4 w-8 h-8 text-[#C48765]" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {isRTL ? feature.ar.title : feature.en.title}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  {isRTL ? feature.ar.description : feature.en.description}
                </p>

                <ul className="space-y-3">
                  {(isRTL ? feature.ar.features : feature.en.features).map((item, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <span className="w-2 h-2 bg-[#C48765] rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
