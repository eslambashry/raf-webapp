import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const FloatingButtons = () => {
  const locale = useLocale();
  const t = useTranslations('floatingButtons');
  const isRTL = locale === 'ar';

  return (
    <div className={`fixed bottom-8 ${isRTL ? 'right-8' : 'left-8'} flex flex-col gap-4 z-50`}>
      <Link 
        href="https://wa.me/+966536667967"
        target="_blank"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('whatsapp')}
      >
        <FaWhatsapp size={24} />
      </Link>

      <Link
        href="tel:0536667967"
        className="bg-[#540f6b] hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={t('phone')}
      >
        <FaPhone size={24} />
      </Link>
    </div>
  );
};

export default FloatingButtons;
