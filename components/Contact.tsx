'use client';
import Image from 'next/image';
import { z } from 'zod';
import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react';

// Schema and input fields configuration remain the same
const contactSchema = z.object({
  senderName: z.string().min(2).max(50),
  senderEmail: z.string().email(),
  phone: z.string().regex(/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/),
  messageContent: z.string().min(1).max(500)
});

const inputFields = [
  { name: 'senderName', type: 'text', icon: User },
  { name: 'phone', type: 'tel', icon: Phone },
  { name: 'senderEmail', type: 'email', icon: Mail },
];

export default function Contact() {
  // State management and form handling remain the same
  const locale = useLocale();
  const t = useTranslations('contact');
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    phone: '',
    messageContent: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);

    try {
      const validatedData = contactSchema.parse(formData);
      const response = await fetch('http://localhost:8080/message/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setFormData({
        senderName: '',
        senderEmail: '',
        phone: '',
        messageContent: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) formattedErrors[err.path[0]] = t(`validation.${err.path[0]}`);
        });
        setErrors(formattedErrors);
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="relative min-h-screen bg-[#EFEDEA] text-[#34222E] py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#34222E] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#34222E] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 bg-[#34222E]/5 rounded-full text-sm font-medium mb-4"
            >
             {t('contactUs')}
            </motion.span>
            <h2 className={`text-5xl font-bold mb-6 text-[#34222E] ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('title')}
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-2 lg:order-1"
            >
              <form onSubmit={handleSubmit}
                    className="space-y-6 bg-[#EFEDEA] p-8 rounded-3xl border border-[#34222E]/10 shadow-xl"
                    dir={isRTL ? 'rtl' : 'ltr'}>
                
                {inputFields.map(({ name, type, icon: Icon }) => (
                  <div key={name} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon className="h-5 w-5 text-[#34222E]/60" />
                    </div>
                    <input
                      type={type}
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                      className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#34222E]/10 rounded-xl
                                focus:ring-2 focus:ring-[#34222E]/20 focus:border-transparent
                                placeholder-[#34222E]/50 text-[#34222E] transition-all duration-300`}
                      placeholder={t(name.replace('sender', '').toLowerCase())}
                    />
                    {errors[name] && (
                      <span className="text-red-600 text-sm mt-1 block">{errors[name]}</span>
                    )}
                  </div>
                ))}

                <div className="relative">
                  <div className="absolute top-4 left-4">
                    <MessageSquare className="h-5 w-5 text-[#34222E]/60" />
                  </div>
                  <textarea
                    name="messageContent"
                    value={formData.messageContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, messageContent: e.target.value }))}
                    rows={4}
                    className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#34222E]/10 rounded-xl
                              focus:ring-2 focus:ring-[#34222E]/20 focus:border-transparent
                              placeholder-[#34222E]/50 text-[#34222E] transition-all duration-300`}
                    placeholder={t('message')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#34222E] text-[#EFEDEA] rounded-xl
                           hover:bg-[#34222E]/90 transition-all duration-300
                           flex items-center justify-center space-x-2 disabled:opacity-50
                           shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Send className="h-5 w-5" />
                  <span>{isSubmitting ? t('sending') : t('send')}</span>
                </button>

                {submitStatus && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center ${
                      submitStatus === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t(`${submitStatus}Message`)}
                  </motion.p>
                )}
              </form>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2 h-[600px] rounded-3xl overflow-hidden
                         border border-[#34222E]/10 shadow-2xl"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7960960420257!2d46.6893654!3d24.7136225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2KfZhNix2YrYp9i2INin2YTYs9i52YjYr9mK2Kk!5e0!3m2!1sar!2ssa!4v1709917391044!5m2!1sar!2ssa"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
