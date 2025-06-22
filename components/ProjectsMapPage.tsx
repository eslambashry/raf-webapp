"use client";

import { useState, useEffect } from "react";
import ProjectsMap from "@/components/ProjectsMap";
import axios from "axios";
import { useLocale } from "next-intl";

// Define the project data types based on the actual API responses
interface CategoryProgress {
  completedPercentage: number;
  availablePercentage: number;
  reservedPercentage: number;
  unavailablePercentage: number;
  total: number;
}

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
  progress?: CategoryProgress;
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
  rating?: number;
  completionDate?: string;
  developer?: string;
}

// Enhanced Jeddah area coordinates with more realistic project placement and real area names
const JEDDAH_AREAS = [
  { 
    name: "حي الزهراء - مشروع 24", 
    lat: 21.6081356, 
    lng: 39.1403372, 
    type: "residential",
    features: ["موقع متميز", "أنظمة منزل ذكية", "حديقة خاصة", "خدمات أمن"],
    area: 120,
    price: 850000
  },
  { 
    name: "حي السلامة", 
    lat: 21.6088056, 
    lng: 39.1511331, 
    type: "residential",
    features: ["تشطيبات فاخرة", "نادي رياضي", "موقف سيارات", "مسبح"],
    area: 95,
    price: 720000
  },
  { 
    name: "حي زهرة النعيم", 
    lat: 21.619518, 
    lng: 39.1537272, 
    type: "residential",
    features: ["موقع استراتيجي", "حديقة مركزية", "مركز تجاري", "مدرسة"],
    area: 150,
    price: 950000
  },
  { 
    name: "حي الروضة - مشروع 28", 
    lat: 21.570298, 
    lng: 39.157425, 
    type: "residential",
    features: ["تصميم عصري", "أمن 24/7", "مسبح أولمبي", "صالة رياضية"],
    area: 180,
    price: 1200000
  },
  { 
    name: "حي الروضة - مشروع 29", 
    lat: 21.574852, 
    lng: 39.154967, 
    type: "residential",
    features: ["فيلات فاخرة", "حدائق خاصة", "موقف مغطى", "خدمات فندقية"],
    area: 220,
    price: 1500000
  },
  { 
    name: "حي الزهراء - مشروع 25", 
    lat: 21.5898037, 
    lng: 39.1402326, 
    type: "residential",
    features: ["موقع بحري", "شاطئ خاص", "مرسى يخوت", "فندق 5 نجوم"],
    area: 300,
    price: 2500000
  },
  { 
    name: "حي الكورنيش", 
    lat: 21.5433, 
    lng: 39.1678, 
    type: "residential",
    features: ["إطلالة بحرية", "كورنيش خاص", "مطاعم فاخرة", "مركز تجاري"],
    area: 140,
    price: 1800000
  },
  { 
    name: "حي الشاطئ", 
    lat: 21.5283, 
    lng: 39.1619, 
    type: "residential",
    features: ["شاطئ خاص", "مرسى", "فيلات فاخرة", "خدمات VIP"],
    area: 250,
    price: 3000000
  },
  { 
    name: "حي النزهة", 
    lat: 21.5854, 
    lng: 39.1723, 
    type: "residential",
    features: ["حدائق واسعة", "ملاعب رياضية", "مركز صحي", "مكتبة"],
    area: 160,
    price: 1100000
  },
  { 
    name: "حي البلد", 
    lat: 21.5433, 
    lng: 39.1678, 
    type: "commercial",
    features: ["موقع تجاري", "موقف كبير", "مخازن", "مكاتب"],
    area: 80,
    price: 800000
  }
];

export default function ProjectsMapPage() {
  const locale = useLocale();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = locale === 'ar'
          ? "https://raf-backend.vercel.app/category/getAllCategoryTitleImageAR/?page=1&size=20"
          : "https://raf-backend.vercel.app/category/getAllCategoryTitleImageEN?page=1&size=20";
        
        const categoriesResponse = await axios.get(apiUrl);
        const categoriesData = categoriesResponse.data;
        
        if (Array.isArray(categoriesData.categories)) {
          const projectsData: ProjectData[] = categoriesData.categories.map((category: Category, index: number) => {
            const areaIndex = index % JEDDAH_AREAS.length;
            const area = JEDDAH_AREAS[areaIndex];
            
            // Generate realistic progress data
            const progress = category.progress || {
              completedPercentage: Math.floor(Math.random() * 40) + 10,
              availablePercentage: Math.floor(Math.random() * 30) + 20,
              reservedPercentage: Math.floor(Math.random() * 30) + 5,
              unavailablePercentage: Math.floor(Math.random() * 20) + 5,
              total: 100
            };
            
            // Generate realistic area and price data
            const projectArea = category.area || area.area + Math.floor(Math.random() * 50) - 25;
            const projectPrice = area.price + Math.floor(Math.random() * 200000) - 100000;
            
            return {
              _id: category._id,
              title: category.title,
              image: category.Image?.secure_url || "/images/placeholder.jpg",
              type: area.type,
              coordinates: { lat: area.lat, lng: area.lng },
              description: category.description || `مشروع سكني فاخر في ${area.name} يوفر نمط حياة عصري ومتطور مع جميع الخدمات والمرافق الحديثة.`,
              area: projectArea,
              price: projectPrice,
              features: ['وحدات سكنية حديثة', 'تشطيبات فاخرة', 'موقف سيارات'],
              progress: {
                completedPercentage: progress.completedPercentage,
                availablePercentage: progress.availablePercentage,
                reservedPercentage: progress.reservedPercentage,
                total: progress.total
              },
              location: area.name,
              status: progress.completedPercentage > 50 ? "مكتمل" : "قيد الإنشاء",
              rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
              completionDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
              developer: "شركة RAF للتطوير العقاري"
            };
          });
          
          setProjects(projectsData);
        } else {
          setError("Invalid data format received from API");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px] w-full">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#540f6b]/20 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#540f6b] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[600px] w-full">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-600 font-cairo">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-[#540f6b] text-white rounded-lg hover:bg-[#540f6b]/90 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[600px]">
      <ProjectsMap projects={projects} />
    </div>
  );
} 