import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  fees: number;
  experience: number;
  bio: string;
  availability: any;
  rating?: number; // Mocked for now
  reviewCount?: number; // Mocked for now
  image?: string; // Mocked for now
}

export default function FindDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, fees-low, fees-high, experience
  const { theme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [searchTerm, specializationFilter, sortBy, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      // Add mock data for rating and image if missing
      const enhancedData = data.map((d: any, index: number) => ({
        ...d,
        rating: d.rating ? d.rating.toFixed(1) : (4 + Math.random()).toFixed(1),
        reviewCount: d.review_count || Math.floor(Math.random() * 100) + 10,
        image: d.image_url || `https://images.unsplash.com/photo-${['1612349317150-b4636e56bccb', '1594824476969-23adf227d07e', '1622253637565-25db24354cfa', '1612563815131-d146d6439f53'][index % 4]}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
      }));
      setDoctors(enhancedData);
      setFilteredDoctors(enhancedData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDoctors = () => {
    let result = [...doctors];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(term) || 
        d.specialization?.toLowerCase().includes(term) ||
        d.bio?.toLowerCase().includes(term)
      );
    }

    // Filter
    if (specializationFilter) {
      result = result.filter(d => d.specialization === specializationFilter);
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'fees-low') {
      result.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    } else if (sortBy === 'fees-high') {
      result.sort((a, b) => (b.fees || 0) - (a.fees || 0));
    } else if (sortBy === 'experience') {
      result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }

    setFilteredDoctors(result);
  };

  const specializations = Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)));

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${isDashboard ? '' : ''}`}>
      {/* Header - Only show if not in dashboard */}
      {!isDashboard && (
        <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </Link>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Find Doctors</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Could add user profile or login here */}
            </div>
          </div>
        </header>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isDashboard ? '' : 'py-8'}`}>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white flex items-center">
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </h2>
                <button 
                  onClick={() => {setSpecializationFilter(''); setSearchTerm('');}}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specialization</label>
                  <select 
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="fees-low">Fees: Low to High</option>
                    <option value="fees-high">Fees: High to Low</option>
                    <option value="experience">Most Experienced</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Search doctors by name, specialization, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Doctor List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm h-64"></div>
                ))}
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="h-20 w-20 rounded-xl object-cover border border-slate-100 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{doctor.name}</h3>
                            <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                              <Star className="h-3.5 w-3.5 text-amber-400 fill-current mr-1" />
                              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{doctor.rating}</span>
                            </div>
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">{doctor.specialization}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{doctor.experience} years experience</p>
                          
                          <div className="mt-3 flex items-center text-sm text-slate-600 dark:text-slate-300">
                            <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                            <span className="truncate">New York Medical Center</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                          <DollarSign className="h-4 w-4 mr-1 text-emerald-500" />
                          <span className="font-semibold text-slate-900 dark:text-white">${doctor.fees}</span>
                          <span className="text-xs ml-1 text-slate-500">/ visit</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          <span>Available Today</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{doctor.reviewCount} reviews</span>
                      <Link 
                        to="/login" // Or booking page if logged in
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <Search className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No doctors found</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
