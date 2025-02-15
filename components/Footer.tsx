'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const socialLinks = [
  { icon: '/facebook.svg', name: 'Facebook', url: '#' },
  { icon: '/instagram.svg', name: 'Instagram', url: '#' },
  { icon: '/Twitter Bird.svg', name: 'Twitter', url: '#' },
  { icon: '/tiktok.svg', name: 'TikTok', url: '#' }
];

const quickLinks = [
  { text: 'nav.home', href: '/' },
  { text: 'nav.projects', href: '/projects' },
  { text: 'nav.about', href: '/about' },
  { text: 'nav.contact', href: '/contact' }
];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#34222E] text-[#EFEDEA]">
      {/* Newsletter Section */}


      {/* Main Footer Content */}
      <div className="border-t border-[#EFEDEA]/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <Image
                src="/logo1.jpg"
                alt={t('footer.companyName')}
                width={180}
                height={60}
                className="mb-6"
              />
              <p className="text-[#EFEDEA]/80 leading-relaxed mb-6">
                {t('footer.companyDescription')}
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 rounded-full border border-[#EFEDEA]/20 flex items-center justify-center
                             hover:bg-[#EFEDEA] hover:border-[#EFEDEA] group transition-all duration-300"
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6">{t('footer.quickLinks')}</h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#EFEDEA]/80 hover:text-[#EFEDEA] transition-colors duration-300
                               flex items-center gap-2 group"
                    >
                      <span>{t(link.text)}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold mb-6">{t('footer.contactUs')}</h4>
              <ul className="space-y-6">
                {[
                  { icon: Phone, text: '000 123 456 789', subtext: t('footer.mainNumber'), href: 'tel:000 123 456 789' },
                  { icon: Mail, text: 'info@raf.sa', subtext: t('footer.email'), href: 'mailto:info@raf.sa' },
                  { icon: MapPin, text: t('footer.address'), subtext: t('footer.country') }
                ].map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <Link href={item.href} className="group flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#EFEDEA]/10 flex items-center justify-center
                                    group-hover:bg-[#EFEDEA] transition-all duration-300">
                          <item.icon className="w-5 h-5 group-hover:text-[#34222E] transition-colors" />
                        </div>
                        <div>
                          <span className="block text-lg group-hover:text-[#EFEDEA] transition-colors">
                            {item.text}
                          </span>
                          <span className="text-sm text-[#EFEDEA]/60">{item.subtext}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#EFEDEA]/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-lg">{item.text}</span>
                          <span className="text-sm text-[#EFEDEA]/60">{item.subtext}</span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden h-[200px] border border-[#EFEDEA]/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7960960420257!2d46.6893654!3d24.7136225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2z2KfZhNix2YrYp9i2INin2YTYs9i52YjYr9mK2Kk!5e0!3m2!1sar!2ssa!4v1709917391044!5m2!1sar!2ssa"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-[#EFEDEA]/10 text-center">
            <p className="text-[#EFEDEA]/60">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
