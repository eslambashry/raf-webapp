'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import ClientOnly from '@/components/ClientOnly';
import { Grid, Layout, LayoutGrid } from 'lucide-react';

interface Category {
  _id: string;
  title: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  isWishlisted?: boolean;
  progress?: {
    total: number;
    sold: number;
    reserved: number;
  };
}

export default function Projects() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'horizontal'>('horizontal');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(new Set(JSON.parse(savedWishlist)));
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = locale === 'ar'
          ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=100'
          : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=100';

        const response = await fetch(apiUrl);
        const data = await response.json();
        setCategories(data.category.map((cat: Category) => ({
          ...cat,
          isWishlisted: wishlist.has(cat._id),
          progress: {
            total: 100,
            sold: Math.floor(Math.random() * 70),
            reserved: Math.floor(Math.random() * 20)
          }
        })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [locale, wishlist]);

  const toggleWishlist = (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const newWishlist = new Set(wishlist);
    if (wishlist.has(categoryId)) {
      newWishlist.delete(categoryId);
    } else {
      newWishlist.add(categoryId);
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(Array.from(newWishlist)));
  };

  const calculateProgress = (progressData?: { total: number; sold: number; reserved: number }) => {
    if (!progressData) {
      return { sold: 0, reserved: 0, available: 100 };
    }
    
    const { total, sold, reserved } = progressData;
    const soldPercentage = (sold / total) * 100;
    const reservedPercentage = (reserved / total) * 100;
    const availablePercentage = 100 - soldPercentage - reservedPercentage;
    
    return {
      sold: soldPercentage,
      reserved: reservedPercentage,
      available: availablePercentage
    };
  };

  const renderHorizontalView = (category: Category) => {
    const progress = calculateProgress(category.progress);
    const isHovered = hoveredCard === category._id;
    
    return (
      <div 
        key={category._id}
        className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
        onMouseEnter={() => setHoveredCard(category._id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="flex flex-col md:flex-row h-full">
          <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
            <Image
              src={category.Image.secure_url}
              alt={category.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 blur-[2px]' : ''
              }`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r from-black/60 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-80' : 'opacity-50'
            }`} />
            
            <button
              onClick={(e) => toggleWishlist(category._id, e)}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-6 h-6 transition-all duration-300 ${
                  wishlist.has(category._id) 
                    ? 'text-red-500 fill-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={wishlist.has(category._id) ? "0" : "2"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-2xl font-bold text-[#34222e] mb-6 font-cairo">
                {category.title}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{t('sold')}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {Math.round(progress.sold)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress.sold}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{t('reserved')}</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      {Math.round(progress.reserved)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress.reserved}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{t('available')}</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {Math.round(progress.available)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${progress.available}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/projects/${category._id}`}
              className="mt-8 block"
            >
              <button className="w-full bg-gradient-to-r from-[#c48765] to-[#b37654] text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold">
                {t('viewProject')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mt-10 text-[#34222e] font-cairo mb-4">
                {t('sectionTitle')}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#c48765] to-[#e2b399] mx-auto rounded-full" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-end mb-8">
              <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'horizontal' 
                      ? 'bg-[#c48765] text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Layout className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={
              viewMode === 'horizontal'
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-10'
                : ''
            }>
              {categories.map((category) => (
                viewMode === 'horizontal' 
                  ? renderHorizontalView(category)
                  : ''
              ))}
            </div>
          </div>
        </section>

        <FAQ />
        <Footer />
      </main>
    </ClientOnly>
  );
}