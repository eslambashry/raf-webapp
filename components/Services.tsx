import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const services = [
  { id: 1, key: 'rental', icon: '🏠' },
  { id: 2, key: 'communication', icon: '📱' },
  { id: 3, key: 'maintenance', icon: '🔧' },
  { id: 4, key: 'water', icon: '💧' },
  { id: 5, key: 'staff', icon: '👥' },
  { id: 6, key: 'electricity', icon: '⚡' }
];

export default function Services() {
  const t = useTranslations('services');

  return (
    <section className="relative  bg-gradient-to-b from-[#EFEDEA] via-white to-[#EFEDEA]">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="text-[#C48765] text-xl font-medium mb-4 block">
            {t('ourServices')}
          </span>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-[#34222E] leading-tight mb-8">
            {t('afterSaleTitle')}
          </h2>
          
          <div className="w-40 h-1.5 bg-gradient-to-r from-[#C48765] to-[#34222E] mx-auto mb-8 rounded-full" />
          
          <p className="text-xl text-[#666] max-w-3xl mx-auto font-medium leading-relaxed">
            {t('freeServices')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-[#EFEDEA] rounded-3xl overflow-hidden p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-[#34222E]/5 to-transparent rounded-bl-full" />
                
                <div className="relative">
                  <span className="text-4xl mb-6 block">{service.icon}</span>
                  
                  <div className="w-12 h-1 bg-[#C48765] mb-6 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300" />
                  
                  <h3 className="text-2xl font-bold text-[#34222E] mb-4 group-hover:text-[#C48765] transition-colors duration-300">
                    {t(`items.${service.key}`)}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {t(`descriptions.${service.key}`)}
                  </p>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#34222E] to-[#C48765] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C48765]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#34222E]/5 rounded-full translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
