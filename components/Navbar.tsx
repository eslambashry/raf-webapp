'use client';
import { Search, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import ClientOnly from "./ClientOnly";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { text: t('home'), href: "/", active: pathname === '/' },
    { text: t('about'), href: "/about", active: pathname === '/about' },
    { text: t('projects'), href: "/projects", active: pathname === '/projects' },
    { text: t('blog'), href: "/blogs", active: pathname === '/blogs' },
    { text: t('contact'), href: "/contact", active: pathname === '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    router.push(`/${newLocale}`);
  };

  return (
    <ClientOnly>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#EFEDEA]/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className={`container mx-auto px-4 2xl:px-8 flex items-center justify-between h-24 ${
          locale === 'ar' ? 'flex-row' : 'flex-row-reverse'
        }`}>
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Image
              src="/logo1.jpg"
              alt="Logo"
              width={140}
              height={80}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className={`hidden lg:flex items-center gap-2 border-2 border-[#34222E] rounded-full px-3 py-3
                         backdrop-blur-sm bg-[#EFEDEA]/50`}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {navItems.map((item) => (
              <li key={item.text}>
                <Link
                  href={item.href}
                  className={`text-base xl:text-lg font-medium px-4 xl:px-6 py-3 rounded-full transition-all duration-300
                             hover:scale-105 ${
                    item.active
                      ? "bg-[#34222E] text-[#EFEDEA]"
                      : "text-[#34222E] hover:bg-[#34222E]/10"
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="border-2 border-[#34222E] text-[#34222E] px-4 py-2 rounded-full text-sm font-medium
                       hover:bg-[#34222E] hover:text-[#EFEDEA] transition-all duration-300
                       active:scale-95"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button className="border-2 border-[#34222E] p-2 rounded-full text-[#34222E]
                             hover:bg-[#34222E] hover:text-[#EFEDEA] transition-all duration-300
                             active:scale-95">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden border-2 border-[#34222E] p-2 rounded-full text-[#34222E]
                       hover:bg-[#34222E] hover:text-[#EFEDEA] transition-all duration-300
                       active:scale-95"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-[#34222E]/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={() => setIsOpen(false)} />

        {/* Mobile Menu */}
        <div className={`absolute top-24 ${locale === 'ar' ? 'right-4' : 'left-4'} 
                        w-[calc(100%-2rem)] max-w-md bg-[#EFEDEA] shadow-2xl rounded-2xl
                        transition-all duration-300 ease-out transform lg:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
        }`}>
          <div className="p-6">
            <ul className="space-y-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              {navItems.map((item) => (
                <li key={item.text}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-medium px-6 py-4 rounded-xl transition-all duration-300
                              active:scale-98 ${
                      item.active
                        ? "bg-[#34222E] text-[#EFEDEA]"
                        : "text-[#34222E] hover:bg-[#34222E]/10"
                    }`}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </ClientOnly>
  );
}
