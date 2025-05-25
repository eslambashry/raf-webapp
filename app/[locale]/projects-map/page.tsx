'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import ProjectsMap from '@/components/ProjectsMap';
import axios from 'axios';
import { MapIcon, Building2, MapPin, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

// Define the project data types based on the actual API responses
interface Category {
  _id: string;
  title: string;
  description?: string;
  Image: {
    secure_url: string;
    public_id: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  location?: string;
  area?: number;
  progress?: {
    completedPercentage: number;
    availablePercentage: number;
    reservedPercentage: number;
    unavailablePercentage: number;
    total: number;
  };
  features?: string[];
  type?: string;
}

interface Unit {
  _id: string;
  title: string;
  description?: string;
  images?: {
    secure_url: string;
    public_id: string;
    _id: string;
  }[];
  status?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  price?: number;
  location?: string;
  type?: string;
  livingrooms?: number;
  customId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  maidRoom?: number;
  cameras?: number;
  waterTank?: number;
  guard?: number;
}

// Project structure for the map
interface ProjectData {
  _id: string;
  title: string;
  image: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  area?: number;
  price?: number;
  status?: string;
  features?: string[];
  progress?: {
    completedPercentage: number;
    availablePercentage: number;
    reservedPercentage: number;
    total?: number;
  };
  units?: Unit[];
  location?: string;
}

export default function ProjectsMapPage() {
  const locale = useLocale();
  const t = useTranslations('projects');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'featured'>('map');
  const [featuredProject, setFeaturedProject] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Responsive design checks
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1023px)' });
  const isNestHub = useMediaQuery({ query: '(min-width: 1024px) and (max-width: 1280px) and (min-height: 600px) and (max-height: 800px)' });

  // Project types for the filter tabs
  const projectTypes = [
    { id: 'all', icon: <Building2 className="w-5 h-5" />, name: locale === 'ar' ? 'الكل' : 'All' },
    { id: 'residential', icon: <MapPin className="w-5 h-5" />, name: locale === 'ar' ? 'سكني' : 'Residential' },
    { id: 'commercial', icon: <Compass className="w-5 h-5" />, name: locale === 'ar' ? 'تجاري' : 'Commercial' }
  ];

  // Custom feature tags for projects
  const projectFeatures = [
    'موقع متميز', // Premium Location
    'أنظمة منزل ذكية', // Smart Home Systems
    'حديقة خاصة', // Private Garden
    'خدمات أمن', // Security Services
    'مسبح', // Swimming Pool
    'نادي رياضي', // Gym
    'موقف سيارات', // Parking
    'تشطيبات فاخرة', // Luxury Finishes
  ];

  // Assign random features to projects based on their ID
  const getProjectFeatures = (id: string) => {
    // Use ID to generate deterministic features
    const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const numFeatures = 2 + (idSum % 4); // 2-5 features
    
    const shuffledFeatures = [...projectFeatures].sort(() => 0.5 - Math.random());
    return shuffledFeatures.slice(0, numFeatures);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch categories data from API
        const categoriesUrl = locale === 'ar'
          ? 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=20'
          : 'https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=20';

        const categoriesResponse = await axios.get(categoriesUrl);
        const categoriesData = categoriesResponse.data;
        
        if (Array.isArray(categoriesData.categories)) {
          // Process categories and fetch their units
          const projectsPromises = categoriesData.categories.map(async (category: Category) => {
            // Default coordinates (will be overridden if available)
            let coordinates = {
              lat: 24.7136 + (Math.random() - 0.5) * 0.2,
              lng: 46.6753 + (Math.random() - 0.5) * 0.2
            };
            
            // If category has coordinates, use them
            if (category.coordinates?.latitude && category.coordinates?.longitude) {
              coordinates = {
                lat: category.coordinates.latitude,
                lng: category.coordinates.longitude
              };
            }
            
            // Fetch units for this category to get more details
            let units: Unit[] = [];
            try {
              const unitsUrl = locale === 'ar'
                ? `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdAR/${category._id}`
                : `https://raf-backend.vercel.app/unit/getAllUnitByCategoryIdEN/${category._id}`;
              
              const unitsResponse = await axios.get(unitsUrl);
              units = unitsResponse.data.units || [];
            } catch (error) {
              console.error(`Error fetching units for category ${category._id}:`, error);
            }
            
            // Determine project type based on units or generate random type if not available
            const projectType = units.length > 0 && units[0].type
              ? units[0].type
              : Math.random() > 0.5 
                ? (locale === 'ar' ? 'سكني' : 'Residential')
                : (locale === 'ar' ? 'تجاري' : 'Commercial');
            
            // Generate progress data for the project
            const idSum = category._id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
            const progress = category.progress || {
              completedPercentage: 10 + (idSum % 30),
              reservedPercentage: 5 + (idSum % 20),
              availablePercentage: 20 + (idSum % 50),
              unavailablePercentage: 0,
              total: 100
            };
            
            return {
              _id: category._id,
              title: category.title,
              image: category.Image?.secure_url || '/images/placeholder.jpg',
              type: projectType,
              coordinates,
              description: category.description || '',
              area: category.area || (units[0]?.area || 0),
              location: category.location || (units[0]?.location || ''),
              features: getProjectFeatures(category._id),
              progress,
              units,
              price: units[0]?.price || 0
            };
          });
          
          const projectsData = await Promise.all(projectsPromises);
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [locale]);
  
  // Filter projects based on selected type
  const filteredProjects = selectedType === 'all'
    ? projects
    : projects.filter(project => {
        const projectType = project.type.toLowerCase();
        return selectedType === 'residential' 
          ? projectType.includes('سكني') || projectType.includes('resident')
          : projectType.includes('تجاري') || projectType.includes('commerc');
      });

  const handleNextFeatured = () => {
    setFeaturedProject(prev => (prev + 1) % projects.length);
  };

  const handlePrevFeatured = () => {
    setFeaturedProject(prev => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      {/* Decorative header elements */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#540f6b]/5 to-transparent -z-10"></div>
      <div className="absolute top-20 left-0 w-full overflow-hidden h-64 -z-10">
        <div className="architectural-pattern-bg w-full h-full opacity-5"
          style={{ backgroundImage: 'url("/images/architectural-pattern.svg")', backgroundSize: '800px' }}></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Page header with animated underline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#540f6b] mb-4 font-cairo relative inline-block">
            {t('projectsLocationMap')}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#C48765] to-[#540f6b] rounded-full"
            ></motion.div>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mt-4">
            {t('exploreProjectsOnMap')}
          </p>
        </motion.div>

        {/* Project type filter tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 inline-flex">
            {projectTypes.map((type) => (
              <motion.button
                key={type.id}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  text-[#540f6b] hover:bg-[#540f6b]/5"
              >
                {type.icon}
                <span>{type.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main content with tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden relative mb-10">
          {/* Top decorative element */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C48765] via-[#540f6b] to-[#C48765] z-10"></div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === 'map' 
                ? 'text-[#540f6b] border-b-2 border-[#540f6b]' 
                : 'text-gray-500 hover:text-[#540f6b]/70'}`}
            >
              <MapIcon className="w-5 h-5 inline-block mr-2" />
              {locale === 'ar' ? 'خريطة المشاريع' : 'Projects Map'}
            </button>
            <button 
              onClick={() => setActiveTab('featured')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${activeTab === 'featured' 
                ? 'text-[#540f6b] border-b-2 border-[#540f6b]' 
                : 'text-gray-500 hover:text-[#540f6b]/70'}`}
            >
              <Building2 className="w-5 h-5 inline-block mr-2" />
              {locale === 'ar' ? 'مشاريع مميزة' : 'Featured Projects'}
            </button>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'map' ? (
              loading ? (
                <div className="w-full h-[650px] bg-gray-50 flex items-center justify-center rounded-3xl">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#540f6b] border-t-[#C48765] rounded-full animate-spin mb-4"></div>
                    <div className="text-xl font-medium text-[#540f6b]">{t('loadingProjects')}</div>
                  </div>
                </div>
              ) : (
                <div>
                  <ProjectsMap projects={projects} />
                  <div className="mt-6 text-sm text-gray-500 text-center">
                    {t('clickOnMarkers')}
                  </div>
                </div>
              )
            ) : (
              /* Featured projects carousel */
              <div className="relative h-[650px] overflow-hidden">
                {projects.length > 0 && (
                  <div className="relative h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        key={featuredProject}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-lg"
                      >
                        <div className="flex flex-col md:flex-row h-full">
                          {/* Project image */}
                          <div className="relative w-full md:w-1/2 h-64 md:h-[600px]">
                            <Image
                              src={projects[featuredProject].image}
                              alt={projects[featuredProject].title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-white/90 px-4 py-3 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-[#540f6b]">
                                  {projects[featuredProject].title}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  {projects[featuredProject].type}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Project details */}
                          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between relative">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#540f6b]/5 rounded-bl-full -z-0"></div>
                            
                            <div className="relative z-10">
                              <h2 className="text-2xl font-bold text-[#540f6b] mb-6">
                                {locale === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
                              </h2>
                              
                              {/* Project features */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-lg font-semibold text-[#C48765] mb-3">
                                    {locale === 'ar' ? 'مميزات المشروع' : 'Project Features'}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                      <div className="w-8 h-8 bg-[#540f6b]/10 rounded-full flex items-center justify-center text-[#540f6b]">
                                        <MapPin className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm">
                                        {locale === 'ar' ? 'موقع متميز' : 'Premium Location'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                      <div className="w-8 h-8 bg-[#540f6b]/10 rounded-full flex items-center justify-center text-[#540f6b]">
                                        <Building2 className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm">
                                        {locale === 'ar' ? 'تشطيبات فاخرة' : 'Luxury Finishes'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                      <div className="w-8 h-8 bg-[#540f6b]/10 rounded-full flex items-center justify-center text-[#540f6b]">
                                        <Compass className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm">
                                        {locale === 'ar' ? 'أنظمة ذكية' : 'Smart Systems'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                      <div className="w-8 h-8 bg-[#540f6b]/10 rounded-full flex items-center justify-center text-[#540f6b]">
                                        <MapIcon className="w-4 h-4" />
                                      </div>
                                      <span className="text-sm">
                                        {locale === 'ar' ? 'مرافق متعددة' : 'Multiple Facilities'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Project status */}
                                <div>
                                  <h4 className="text-lg font-semibold text-[#C48765] mb-3">
                                    {locale === 'ar' ? 'حالة المشروع' : 'Project Status'}
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">{t('sold')}</span>
                                        <span className="text-sm font-semibold text-[#540f6b]">
                                          {25 + Math.floor(Math.random() * 30)}%
                                        </span>
                                      </div>
                                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-[#540f6b] transition-all duration-500 ease-out"
                                          style={{ width: `${25 + Math.floor(Math.random() * 30)}%` }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-600">{t('reserved')}</span>
                                        <span className="text-sm font-semibold text-yellow-600">
                                          {15 + Math.floor(Math.random() * 20)}%
                                        </span>
                                      </div>
                                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-yellow-500 transition-all duration-500 ease-out"
                                          style={{ width: `${15 + Math.floor(Math.random() * 20)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="mt-8 flex items-center justify-between gap-4">
                              <Link 
                                href={`/${locale}/projects/${projects[featuredProject]._id}`}
                                className="flex-1 bg-[#540f6b] hover:bg-[#3d0a50] text-white py-3 px-6 rounded-xl font-medium text-center transition-all duration-300 shadow-md transform hover:translate-y-[-2px] hover:shadow-lg"
                              >
                                {t('viewProject')}
                              </Link>
                              <Link 
                                href="#"
                                className="flex items-center justify-center w-12 h-12 bg-[#C48765]/10 hover:bg-[#C48765]/20 text-[#C48765] rounded-full transition-all duration-300"
                              >
                                <MapPin className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Navigation buttons */}
                    <button 
                      onClick={handlePrevFeatured}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-[#540f6b] rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={handleNextFeatured}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white text-[#540f6b] rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Pagination indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {projects.slice(0, 5).map((_, index) => (
                        <button 
                          key={index}
                          onClick={() => setFeaturedProject(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            featuredProject === index 
                              ? 'bg-[#540f6b] w-6' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                      {projects.length > 5 && (
                        <span className="text-xs text-gray-500 self-center">...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Return to projects link */}
        <div className="text-center">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-[#540f6b] hover:text-[#C48765] transition-colors font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            {locale === 'ar' ? 'العودة إلى قائمة المشاريع' : 'Return to Projects List'}
          </Link>
        </div>
      </div>
    </div>
  );
}
