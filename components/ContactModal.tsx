'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const t = useTranslations('contactModal');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-[#34222E]" />,
      label: t('phone'),
      value: "0536667967",
      action: "tel:0536667967"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#34222E]" />,
      label: t('whatsapp'),
      value: "0536667967",
      action: "https://wa.me/+966536667967"
    },
    {
      icon: <Mail className="w-6 h-6 text-[#34222E]" />,
      label: t('email'),
      value: "info@rafco.sa",
      action: "mailto:info@rafco.sa"
    }
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} dir={isRTL ? 'rtl' : 'ltr'}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#EFEDEA] p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className={`text-2xl font-bold text-[#34222E] text-center mb-8 ${isRTL ? 'font-cairo' : 'font-sans'}`}
                >
                  {t('title')}
                </Dialog.Title>

                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.action}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg border-2 border-[#34222e] hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#34222e]/10 flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#34222E]">{method.label}</h4>
                        <p className="text-gray-600">{method.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="mt-8 w-full border-2 border-[#34222e] text-[#34222E] rounded-lg py-3 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  {t('close')}
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}