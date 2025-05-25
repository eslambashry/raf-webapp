'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { X, MapPin, Building, Home, Zap, Shield, Droplet, Wifi, Check, PlusCircle, Camera, Warehouse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

// Define the libraries we need
import { Libraries } from "@react-google-maps/api";
const libraries: Libraries = ['places'];

// Define the type for project data
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
  units?: any[];
  location?: string;
}

interface ProjectsMapProps {
  projects?: ProjectData[];
  selectedType?: string;
}

// Define responsive map container styles based on device type
const getContainerStyle = (isMobile: boolean, isTablet: boolean, isNestHub: boolean) => ({
  width: '100%',
  height: isMobile 
    ? '500px' 
    : isTablet 
      ? '580px' 
      : isNestHub 
        ? '600px' 
        : '650px',
  borderRadius: '1rem',
  overflow: 'hidden'
});

// Center on Saudi Arabia by default
const defaultCenter = {
  lat: 24.7136,
  lng: 46.6753
};

// Custom map styles for a more modern look
const mapStyles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e9e9e9" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 17 }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 29 },
      { "weight": 0.2 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 18 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f5f5f5" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      { "color": "#dedede" },
      { "lightness": 21 }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "lightness": 16 }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      { "saturation": 36 },
      { "color": "#333333" },
      { "lightness": 40 }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  }
];

// Helper function to generate feature icons
const getFeatureIcon = (feature: string) => {
  const featureToLower = feature.toLowerCase();
  if (featureToLower.includes('موقع') || featureToLower.includes('location')) {
    return <MapPin className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('ذكي') || featureToLower.includes('smart')) {
    return <Wifi className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('حديقة') || featureToLower.includes('garden')) {
    return <Home className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('أمن') || featureToLower.includes('security')) {
    return <Shield className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('مسبح') || featureToLower.includes('pool')) {
    return <Droplet className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('رياضي') || featureToLower.includes('gym')) {
    return <Zap className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('موقف') || featureToLower.includes('parking')) {
    return <Building className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  if (featureToLower.includes('تشطيبات') || featureToLower.includes('finish')) {
    return <Check className="w-3.5 h-3.5 text-[#540f6b]" />;
  }
  return <Building className="w-3.5 h-3.5 text-[#540f6b]" />;
};

export default function ProjectsMap({ projects = [], selectedType = 'all' }: ProjectsMapProps) {
  const locale = useLocale();
  const t = useTranslations('projects');
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  
  // Responsive design checks
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });
  const isNestHub = useMediaQuery({ query: '(min-width: 1024px) and (max-width: 1280px) and (min-height: 600px) and (max-height: 800px)' });
  
  // Get appropriate card width based on device
  const getCardWidth = () => {
    if (isMobile) return 260;
    if (isTablet || isNestHub) return 290;
    return 320;
  };
  
  // Filter projects based on selected type if needed
  const filteredProjects = selectedType === 'all'
    ? projects
    : projects.filter(project => {
        const projectType = project.type.toLowerCase();
        return selectedType === 'residential' 
          ? projectType.includes('سكني') || projectType.includes('resident')
          : projectType.includes('تجاري') || projectType.includes('commerc');
      });

  // Generate random features for projects that don't have them
  const getRandomFeatures = () => {
    const features = [
      'موقع متميز', // Premium location
      'أنظمة منزل ذكية', // Smart home systems
      'حديقة خاصة', // Private garden
      'خدمات أمن', // Security services
      'تشطيبات فاخرة', // Luxury finishes
      'نادي رياضي', // Gym
      'موقف سيارات', // Parking
      'مسبح', // Swimming pool
    ];
    
    const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4 features
    const shuffled = [...features].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numFeatures);
  };

  // Enhance projects with default values if needed
  const enhancedProjects = filteredProjects.map(project => ({
    ...project,
    features: project.features || getRandomFeatures(),
    progress: project.progress || {
      completedPercentage: Math.floor(Math.random() * 40) + 10,
      reservedPercentage: Math.floor(Math.random() * 30) + 5,
      availablePercentage: Math.floor(Math.random() * 30) + 20,
      total: 100
    }
  }));

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
    language: locale
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
  }, []);

  // If we have projects with coordinates, fit the map to show all markers
  useEffect(() => {
    if (mapLoaded && mapRef.current && enhancedProjects.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      enhancedProjects.forEach(project => {
        bounds.extend(project.coordinates);
      });
      mapRef.current.fitBounds(bounds);
      
      // Adjust zoom level to not be too zoomed in with few markers
      if (enhancedProjects.length < 3) {
        const listener = google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
          if (mapRef.current && mapRef.current.getZoom() && mapRef.current.getZoom()! > 15) {
            mapRef.current.setZoom(15);
          }
        });
        return () => google.maps.event.removeListener(listener);
      }
    }
  }, [enhancedProjects, mapLoaded]);

  const handleMarkerClick = (project: ProjectData) => {
    setSelectedProject(project);
  };

  const handleInfoWindowClose = () => {
    setSelectedProject(null);
  };

  const handleMarkerMouseOver = (projectId: string) => {
    setHoveredMarker(projectId);
  };

  const handleMarkerMouseOut = () => {
    setHoveredMarker(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center w-full" style={getContainerStyle(isMobile, isTablet, isNestHub)}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={getContainerStyle(isMobile, isTablet, isNestHub)}
        center={defaultCenter}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          fullscreenControl: !isMobile,
          mapTypeControl: !isMobile,
          streetViewControl: !isMobile,
          zoomControl: true,
          zoomControlOptions: {
            position: 9
          },
          mapTypeControlOptions: {
            position: 3
          }
        }}
      >
        {enhancedProjects.map(project => (
          <Marker
            key={project._id}
            position={project.coordinates}
            onClick={() => handleMarkerClick(project)}
            onMouseOver={() => handleMarkerMouseOver(project._id)}
            onMouseOut={handleMarkerMouseOut}
            icon={{
              url: hoveredMarker === project._id 
                ? '/images/map-marker-hover.svg' 
                : '/images/map-marker.svg',
              scaledSize: new google.maps.Size(hoveredMarker === project._id ? 48 : 40, 
                                             hoveredMarker === project._id ? 48 : 40)
            }}
            animation={hoveredMarker === project._id ? google.maps.Animation.BOUNCE : undefined}
          />
        ))}

        <AnimatePresence>
          {selectedProject && (
            <InfoWindow
              position={selectedProject.coordinates}
              onCloseClick={handleInfoWindowClose}
              options={{
                pixelOffset: new google.maps.Size(0, -40),
                maxWidth: getCardWidth(),
                disableAutoPan: false
              }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="custom-info-window" 
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
                style={{ width: getCardWidth(), borderRadius: '12px', overflow: 'hidden' }}
              >
                <div className="relative bg-white rounded-xl overflow-hidden shadow-lg w-full font-cairo">
                  {/* Gold accent left or right border based on locale */}
                  <div className={`absolute top-0 ${locale === 'ar' ? 'right-0 w-1.5' : 'left-0 w-1.5'} bottom-0 bg-[#C48765] z-10`}></div>
                  
                  {/* Decorative architectural pattern overlay */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none" 
                    style={{ backgroundImage: 'url("/images/architectural-pattern.svg")', backgroundSize: 'cover' }}></div>
                  
                  <div className="p-0.5">
                    <button 
                      onClick={handleInfoWindowClose}
                      className="absolute top-2 right-2 z-10 p-1 bg-white/90 rounded-full hover:bg-white shadow-md transition-all duration-300 hover:scale-110"
                    >
                      <X className="w-3.5 h-3.5 text-[#540f6b]" />
                    </button>

                    <div className="text-center font-bold text-[#540f6b] py-2 text-sm md:text-base border-b border-gray-100 px-2.5 truncate">
                      {selectedProject.title}
                    </div>
                    
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded-md text-[10px] text-[#540f6b] font-medium shadow-md">
                        {selectedProject.type}
                      </div>
                    </div>
                    
                    {/* Project details - price and area if available */}
                    {(selectedProject.price !== undefined || selectedProject.area !== undefined) && (
                      <div className="px-3 py-1.5 flex justify-between items-center border-b border-gray-100">
                        {selectedProject.price !== undefined && selectedProject.price > 0 && (
                          <div className="text-xs">
                            <span className="text-gray-500">{locale === 'ar' ? 'السعر:' : 'Price:'}</span>
                            <span className="text-[#540f6b] font-semibold ml-1">
                              {new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                style: 'currency',
                                currency: 'SAR',
                                maximumFractionDigits: 0,
                                minimumFractionDigits: 0
                              }).format(selectedProject.price)}
                            </span>
                          </div>
                        )}
                        {selectedProject.area && selectedProject.area > 0 && (
                          <div className="text-xs">
                            <span className="text-gray-500">{locale === 'ar' ? 'المساحة:' : 'Area:'}</span>
                            <span className="text-[#540f6b] font-semibold ml-1">
                              {selectedProject.area} m²
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Status indicators - combined into a single progress bar */}
                    <div className="px-3 py-1.5">
                      <div className="flex justify-between items-center mb-1.5 text-[10px]">
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-[#540f6b] mr-1"></div>
                            <span className="text-gray-600">{t('sold')}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                            <span className="text-gray-600">{t('reserved')}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-gray-600">{t('available')}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Combined progress bar */}
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-[#540f6b] transition-all duration-500 ease-out"
                          style={{ width: `${selectedProject.progress?.completedPercentage}%` }}
                        />
                        <div 
                          className="h-full bg-yellow-500 transition-all duration-500 ease-out"
                          style={{ width: `${selectedProject.progress?.reservedPercentage}%` }}
                        />
                        <div 
                          className="h-full bg-green-500 transition-all duration-500 ease-out"
                          style={{ width: `${selectedProject.progress?.availablePercentage}%` }}
                        />
                      </div>
                      
                      {/* Unit count if available */}
                      {selectedProject.progress?.total && (
                        <div className="text-[10px] text-gray-500 text-center mt-1">
                          {locale === 'ar' ? 'إجمالي الوحدات:' : 'Total Units:'} <span className="font-semibold">{selectedProject.progress.total}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Feature tags - limit to 3 with +more */}
                    <div className="flex flex-wrap gap-1 px-3 py-1.5">
                      {selectedProject.features?.slice(0, 3).map((feature, i) => (
                        <div 
                          key={i}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]"
                        >
                          {getFeatureIcon(feature)}
                          <span className="text-gray-700 truncate" style={{ maxWidth: '70px' }}>{feature}</span>
                        </div>
                      ))}
                      {selectedProject.features && selectedProject.features.length > 3 && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                          <PlusCircle className="w-3 h-3 text-[#540f6b]" />
                          <span className="text-[#540f6b]">{selectedProject.features.length - 3} {locale === 'ar' ? 'المزيد' : 'more'}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* View project button */}
                    <div className="p-2.5 pt-1.5 border-t border-gray-100">
                      <Link 
                        href={`/projects/${selectedProject._id}`}
                        className="block w-full text-center bg-[#540f6b] hover:bg-[#540f6b]/90 text-white py-1.5 px-3 rounded text-xs font-medium transition-all duration-300 hover:shadow-lg"
                      >
                        {t('viewProject')}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </InfoWindow>
          )}
        </AnimatePresence>
      </GoogleMap>
      
      {/* Architectural decorative elements */}
      <div className={`absolute top-4 ${locale === 'ar' ? 'right-4' : 'left-4'} bg-white/80 backdrop-blur-sm rounded-full shadow-lg ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} pointer-events-none flex items-center justify-center`}>
        <div className={`relative ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}`}>
          <Image src="/images/compass-rose.svg" alt="Compass" fill />
        </div>
      </div>
      
      {!isMobile && (
        <div className="absolute bottom-8 right-8 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg pointer-events-none shadow-md">
          <p className="text-xs text-[#540f6b] font-cairo">
            {t('mapCredit')}
          </p>
        </div>
      )}
    </div>
  );
}
