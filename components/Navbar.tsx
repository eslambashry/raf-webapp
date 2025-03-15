'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === 'ar';

  const getUserNameFromEmail = (email: string) => {
    return email.split('@')[0];
  };

  const userDisplayName = user ? getUserNameFromEmail(user.email) : '';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    closeMenu();
  };

  const navItems = [
    { text: t('nav.home'), href: "/", active: pathname === `/${locale}` || pathname === `/${locale}/` },
    { text: t('nav.projects'), href: "/projects", active: pathname === `/${locale}/projects` },
    { text: t('nav.contact'), href: "/contact", active: pathname === `/${locale}/contact` },
    { text: t('nav.about'), href: "/about", active: pathname === `/${locale}/about` },
    { text: t('nav.blog'), href: "/blogs", active: pathname === `/${locale}/blogs` },
    { text: t('nav.wishlist'), href: "/wishlist", active: pathname === `/${locale}/wishlist` },
  ];

  const authItems = user 
    ? []
    : [
        { text: t('auth.nav.login'), href: "/auth/login", active: pathname === `/${locale}/auth/login` },
        { text: t('auth.nav.signup'), href: "/auth/signup", active: pathname === `/${locale}/auth/signup` },
      ];

  const allNavItems = [...navItems, ...authItems];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Gradient border at top */}
      <div className="h-1 bg-gradient-to-r from-[#c48765] via-[#34222E] to-[#c48765]"></div>
      
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <div className="relative overflow-hidden rounded pt-1">
            <Image
              src="/logo_2.png"
              alt="RAF Advanced Logo"
              width={50}
              height={50}
              className={`transition-transform duration-300 group-hover:scale-110 ${isArabic ? 'ml-2' : 'mr-2'}`}
            />
          </div>
          <span className="text-xl font-bold text-[#34222E] group-hover:text-[#c48765] transition-colors duration-300">
        راف المتطوره 
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                item.active
                  ? 'text-[#c48765] bg-[#c48765]/10'
                  : 'text-[#34222E] hover:text-[#c48765] hover:bg-[#c48765]/5'
              }`}
            >
              {item.text}
              {item.active && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#c48765] rounded-full transform origin-left transition-transform" />
              )}
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className={`flex items-center px-3 py-2 text-sm font-medium text-[#34222E] hover:text-[#c48765] transition-colors rounded-lg hover:bg-[#c48765]/5 ${userMenuOpen ? 'bg-[#c48765]/10 text-[#c48765]' : ''}`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#34222E] to-[#4a3340] rounded-full flex items-center justify-center text-white mr-2 shadow-sm">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
                <span className={`${isArabic ? 'ml-1' : 'mr-1'}`}>{userDisplayName}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`absolute ${isArabic ? 'right-0' : 'left-0'} mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50 transition-all duration-200 origin-top-right ${
                  userMenuOpen 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 invisible'
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-[#34222E]">{userDisplayName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link 
                  href="/wishlist" 
                  className="flex items-center px-4 py-2 text-sm text-[#34222E] hover:bg-[#c48765]/5 hover:text-[#c48765]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('nav.wishlist')}
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.nav.logout')}
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <Link
                href="/auth/login"
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  pathname === "/auth/login"
                    ? 'text-[#c48765] bg-[#c48765]/10'
                    : 'text-[#34222E] hover:text-[#c48765] hover:bg-[#c48765]/5'
                }`}
              >
                {t('auth.nav.login')}
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-[#34222E] to-[#4a3340] text-white px-5 py-2 rounded-lg text-sm font-medium hover:from-[#2a1c26] hover:to-[#3d2a34] transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 duration-300"
              >
                {t('auth.nav.signup')}
              </Link>
            </div>
          )}

          <Link
            href="/"
            locale={isArabic ? 'en' : 'ar'}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-[#34222E] hover:text-[#c48765] transition-colors rounded-full hover:bg-[#c48765]/5"
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          <Link
            href="/"
            locale={isArabic ? 'en' : 'ar'}
            className="flex items-center justify-center w-10 h-10 text-sm font-medium text-[#34222E] hover:text-[#c48765] transition-colors rounded-full hover:bg-[#c48765]/5"
            aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
          </Link>
          
          <button
            className="p-2 text-[#34222E] focus:outline-none rounded-lg hover:bg-[#c48765]/5"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 flex flex-col items-end justify-center gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-[500px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'text-[#c48765] bg-[#c48765]/10'
                    : 'text-[#34222E] hover:bg-[#c48765]/5 hover:text-[#c48765]'
                }`}
                onClick={closeMenu}
              >
                {item.text}
              </Link>
            ))}

            {user ? (
              <>
                <div className="px-4 py-3 mt-2 mb-1 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#34222E] to-[#4a3340] rounded-full flex items-center justify-center text-white mr-3 shadow-sm">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#34222E]">{userDisplayName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/wishlist"
                  className="px-4 py-3 text-sm font-medium text-[#34222E] hover:bg-[#c48765]/5 hover:text-[#c48765] rounded-lg transition-all duration-200 flex items-center"
                  onClick={closeMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('nav.wishlist')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.nav.logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-100">
                <Link
                  href="/auth/login"
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    pathname === "/auth/login"
                      ? 'text-[#c48765] bg-[#c48765]/10'
                      : 'text-[#34222E] hover:bg-[#c48765]/5 hover:text-[#c48765]'
                  }`}
                  onClick={closeMenu}
                >
                  {t('auth.nav.login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-[#34222E] to-[#4a3340] text-white px-4 py-3 rounded-lg text-sm font-medium text-center hover:from-[#2a1c26] hover:to-[#3d2a34] transition-all shadow-sm"
                  onClick={closeMenu}
                >
                  {t('auth.nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}