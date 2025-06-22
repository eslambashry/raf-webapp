'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin } from 'lucide-react';
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
  units?: {
    _id: string;
    title: string;
    status?: string;
    area?: number;
    price?: number;
  }[];
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
    ? '600px' 
    : isTablet 
      ? '700px' 
      : isNestHub 
        ? '750px' 
        : '800px',
  borderRadius: '1rem',
  overflow: 'hidden'
});

// Center on Jeddah by default - centered on the project areas
const defaultCenter = {
  lat: 21.5948,
  lng: 39.1477
};

// Custom map styles for a more modern look with Jeddah focus
const mapStyles = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#e3f2fd" },
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
      { "color": "#e8f5e8" },
      { "lightness": 21 }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f0f8ff" },
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
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      { "color": "#f2f2f2" },
      { "lightness": 19 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#fefefe" },
      { "lightness": 20 }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#fefefe" },
      { "lightness": 17 },
      { "weight": 1.2 }
    ]
  }
];

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
    if (isMobile) return 320;
    if (isTablet || isNestHub) return 380;
    return 420;
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
          if (mapRef.current && mapRef.current.getZoom() && mapRef.current.getZoom()! > 14) {
            mapRef.current.setZoom(14); // Better zoom level for Jeddah
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
          },
          minZoom: 10,
          maxZoom: 18,
          gestureHandling: 'cooperative',
          backgroundColor: '#f8fafc'
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
                                             hoveredMarker === project._id ? 48 : 40),
              anchor: new google.maps.Point(hoveredMarker === project._id ? 24 : 20, 
                                          hoveredMarker === project._id ? 48 : 40)
            }}
            animation={hoveredMarker === project._id ? google.maps.Animation.BOUNCE : undefined}
            title={project.title}
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
                    <div className="text-center font-bold text-[#540f6b] py-3 text-sm md:text-base border-b border-gray-100 px-3">
                      {selectedProject.title}
                    </div>
                    
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    {/* View project button - enhanced */}
                    <div className="px-4 pb-4">
                      <Link 
                        href={`/projects/${selectedProject._id}`}
                        className="block w-full text-center bg-[#540f6b] hover:bg-[#540f6b]/90 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
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
            {locale === 'ar' ? 'خريطة مشاريع جدة' : 'Jeddah Projects Map'}
          </p>
        </div>
      )}
      
      {/* Jeddah Location Indicator */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 pointer-events-none shadow-md">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#540f6b]" />
          <p className="text-xs text-[#540f6b] font-cairo font-medium">
            {locale === 'ar' ? 'جدة، المملكة العربية السعودية' : 'Jeddah, Saudi Arabia'}
          </p>
        </div>
      </div>
    </div>
  );
}
