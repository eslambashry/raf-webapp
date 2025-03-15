'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import ClientOnly from '@/components/ClientOnly';

interface Category {
  _id: string;
  title: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  progress?: {
    total: number;
    sold: number;
    reserved: number;
  };
}

export default function Wishlist() {
  const locale = useLocale();
  const t = useTranslations('wishlist');
  const [wishlistItems, setWishlistItems] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        // Get wishlist IDs from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];

        if (wishlistIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch all projects
        const apiUrl = locale === 'ar'
          ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=100'
          : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=100';

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filter only wishlisted items
        const wishlisted = data.category.filter((cat: Category) => 
          wishlistIds.includes(cat._id)
        ).map((cat: Category) => ({
          ...cat,
          progress: {
            total: 100,
            sold: Math.floor(Math.random() * 70),
            reserved: Math.floor(Math.random() * 20)
          }
        }));

        setWishlistItems(wishlisted);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, [locale]);

  const removeFromWishlist = (categoryId: string) => {
    const savedWishlist = localStorage.getItem('wishlist');
    const wishlistIds = savedWishlist ? JSON.parse(savedWishlist) : [];
    const newWishlistIds = wishlistIds.filter((id: string) => id !== categoryId);
    localStorage.setItem('wishlist', JSON.stringify(newWishlistIds));
    setWishlistItems(prev => prev.filter(item => item._id !== categoryId));
  };

  const calculateProgress = (progress: Category['progress']) => {
    if (!progress) return { available: 0, sold: 0, reserved: 0 };
    const soldPercentage = (progress.sold / progress.total) * 100;
    const reservedPercentage = (progress.reserved / progress.total) * 100;
    const availablePercentage = 100 - soldPercentage - reservedPercentage;
    return {
      available: availablePercentage,
      sold: soldPercentage,
      reserved: reservedPercentage
    };
  };

  return (
    <ClientOnly>
      <main className="min-h-screen py-12 bg-[#f8f9fa]">
        <Navbar />
        
        <section className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-[#34222e] font-cairo mb-4">
                {t('wishlistTitle')}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#c48765] to-[#e2b399] mx-auto rounded-full" />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c48765]"></div>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💝</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t('emptyWishlistTitle')}</h2>
                <p className="text-gray-500 mb-8">{t('emptyWishlistDescription')}</p>
                <Link href="/projects">
                  <button className="bg-gradient-to-r from-[#c48765] to-[#b37654] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold">
                    {t('browseProjects')}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {wishlistItems.map((item) => {
                  const progress = calculateProgress(item.progress);
                  
                  return (
                    <div 
                      key={item._id}
                      className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      <div className="flex flex-col md:flex-row h-full">
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
                          <Image
                            src={item.Image.secure_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                          
                          {/* Remove from Wishlist Button */}
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="absolute top-4 right-4 p-3 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-red-500 fill-red-500"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Content Section */}
                        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-between bg-white">
                          <div>
                            <h3 className="text-2xl font-bold text-[#34222e] mb-6 font-cairo">
                              {item.title}
                            </h3>
                            
                            {/* Progress Stats */}
                            <div className="space-y-6">
                              {/* Sold Progress */}
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

                              {/* Reserved Progress */}
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

                              {/* Available Progress */}
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

                          {/* View Project Button */}
                          <Link
                            href={`/projects/${item._id}`}
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
                })}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </ClientOnly>
  );
}
