'use client';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/FeatureSection";
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ClientOnly from "@/components/ClientOnly";
import { motion } from 'framer-motion';
import { MapPin, Home, Bath, Car, Bed, Maximize2, Camera, Shield, Droplet, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  title: string;
  description: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area: number;
  location: string;
}

interface Unit {
  _id: string;
  title: string;
  description: string;
  images: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  status: string;
  area: number;
  rooms: number;
  bathrooms: number;
  parking: number;
  price: number;
  location: string;
  type: string;
  livingrooms: number;
  customId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  maidRoom: number;
  cameras: number;
  waterTank: number;
  guard: number;
  nearbyPlaces: [{ place: string, timeInMinutes: number }];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProjectDetails() {
  const locale = useLocale();
  const t = useTranslations('projectDetails');
  const params = useParams() || {};
  const [units, setUnits] = useState<Unit[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const categoryId = params.categoryId as string;

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      try {
        const [unitsResponse, categoryResponse] = await Promise.all([
          fetch(locale === 'ar'
            ? `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdAR/${categoryId}`
            : `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdEN/${categoryId}`),
          fetch(`https://raf-backend.vercel.app/category/getOne/${categoryId}`)
        ]);
        const unitsData = await unitsResponse.json();
        const categoryData = await categoryResponse.json();
        setUnits(unitsData.units);
        setCategory(categoryData.category);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [locale, categoryId]);

  const handleCopyLink = (unitId: string) => {
    const url = `${window.location.origin}/projects/${categoryId}/${unitId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(unitId);
    toast.success(t('linkCopied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLocationLink = () => {
    if (category?.coordinates?.latitude && category?.coordinates?.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${category.coordinates.latitude},${category.coordinates.longitude}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'));
    } else if (category?.location) {
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(category.location)}`;
      navigator.clipboard.writeText(mapUrl);
      toast.success(t('linkCopied'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#c48765]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#c48765] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const renderFeatureIcon = (value: number, Icon: any, label: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="w-5 h-5 text-[#c48765]" />
        <span>{value} {label}</span>
      </div>
    );
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#EFEDEA]">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src={category?.Image.secure_url || ''}
            alt={category?.title || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-bold mb-6"
              >
                {category?.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-32 h-1 bg-[#c48765] mx-auto rounded-full"
              />
            </div>
          </div>
        </section>

        <div className="container max-w-[1312px] mx-auto px-4 py-16">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#c48765]/10 rounded-xl">
                      <MapPin className="w-6 h-6 text-[#c48765]" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">{t('location')}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-[#34222e]">{category?.location}</p>
                        <button
                          onClick={handleCopyLocationLink}
                          className="p-2 hover:bg-[#c48765]/10 rounded-lg transition-colors group relative"
                          aria-label={t('copyLink')}
                        >
                          <Copy className="w-4 h-4 text-[#c48765]" />
                          <span className="absolute -top-8 right-0 bg-[#34222e] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {t('copyLink')}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#c48765]/10 rounded-xl">
                      <Maximize2 className="w-6 h-6 text-[#c48765]" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">{t('area')}</h3>
                      <p className="text-lg font-medium text-[#34222e]">{category?.area} {t('areaUnit')}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#34222e] mb-4">{t('projectDescription')}</h3>
                  <p className="text-gray-600 leading-relaxed">{category?.description}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Units Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {units.map((unit) => (
              <motion.div
                key={unit._id}
                variants={item}
                className={`group bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl
                  ${(unit.status === 'Sold' || unit.status === 'مباع' || unit.status === 'Rented' || unit.status === 'مؤجر' || unit.status === 'Unavailable' || unit.status === 'غير متاح' || unit.status === 'Reserved' || unit.status === 'محجوز')
                    ? 'opacity-90'
                    : 'hover:scale-[1.02]'}`}
              >
                <div className="relative h-[300px]">
                  <Image
                    src={unit.images[0].secure_url}
                    alt={unit.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Status Overlays */}
                  {(() => {
                    switch (unit.status) {
                      case 'Sold':
                      case 'مباع':
                        return (
                          <>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <Image
                                src="/sizes/sold.png"
                                alt="Sold"
                                width={180}
                                height={180}
                                className="object-contain transform scale-125 animate-pulse"
                              />
                            </div>
                          </>
                        );
                      case 'Rented':
                      case 'مؤجر':
                        return (
                          <>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <Image
                                src="/sizes/hagz.png"
                                alt="Rented"
                                width={180}
                                height={180}
                                className="object-contain transform scale-125 animate-pulse"
                              />
                            </div>
                          </>
                        );
                      case 'Available for sale':
                      case 'متاح للبيع':
                        return (
                          <div className="absolute top-4 left-4 px-6 py-2 bg-emerald-500 text-white font-semibold rounded-full shadow-lg">
                            {t('status.availableForSale')}
                          </div>
                        );
                      case 'Available for rent':
                      case 'متاح للإيجار':
                        return (
                          <div className="absolute top-4 left-4 px-6 py-2 bg-[#c48765] text-white font-semibold rounded-full shadow-lg">
                            {t('status.availableForRent')}
                          </div>
                        );
                      case 'Reserved':
                      case 'محجوز':
                        return (
                          <>
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <Image
                                src="/sizes/reserved.png"
                                alt="Reserved"
                                width={180}
                                height={180}
                                className="object-contain transform scale-125 animate-pulse"
                              />
                            </div>
                          </>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#34222e]">{unit.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(unit._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title={t('copyLink')}
                      >
                        {copiedId === unit._id ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/projects/${categoryId}/${unit._id}`;
                          if (navigator.share) {
                            navigator.share({
                              title: unit.title,
                              text: unit.description,
                              url: url,
                            });
                          }
                        }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        title={t('share')}
                      >
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">{t('unitId')}:</span>
                    <span className="text-sm font-medium text-[#c48765]">{unit.customId}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {renderFeatureIcon(unit.rooms, Bed, t('rooms'))}
                    {renderFeatureIcon(unit.livingrooms, Home, t('livingrooms'))}
                    {renderFeatureIcon(unit.bathrooms, Bath, t('bathrooms'))}
                    {renderFeatureIcon(unit.parking, Car, t('parking'))}
                    {renderFeatureIcon(unit.cameras, Camera, t('cameras'))}
                    {renderFeatureIcon(unit.guard, Shield, t('guard'))}
                    {renderFeatureIcon(unit.waterTank, Droplet, t('waterTank'))}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    {/* <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#c48765]" />
                      <span className="text-gray-600">{unit.location}</span>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-[#c48765]" />
                      <span className="text-gray-600">{unit.area} {t('areaUnit')}</span>
                    </div>
                  </div>

                  {unit.price && (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg font-bold text-[#34222e]">{t('price')}:</span>
                      <span className="text-xl font-bold text-[#c48765]">
                        {unit.price.toLocaleString()} {t('currency')}
                      </span>
                    </div>
                  )}

                  <Link href={`/projects/${categoryId}/${unit._id}`}>
                    <button className="w-full bg-gradient-to-r from-[#c48765] to-[#b37654] text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      {t('viewDetails')}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <FeatureSection />
        <Footer />
      </main>
    </ClientOnly>
  );
}
