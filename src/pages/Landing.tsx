import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  Video, 
  FileText, 
  ShoppingBag, 
  Search, 
  CheckCircle, 
  Star, 
  Shield, 
  Users, 
  Menu, 
  X,
  Moon,
  Sun,
  Phone
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">APNA HOSPITAL</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/find-doctors" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Find Doctors</Link>
              <a href="#services" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Services</a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">How it Works</a>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Log in</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">Sign up</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/find-doctors" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800">Find Doctors</Link>
              <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800">Services</a>
              <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800">How it Works</a>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800">Log in</Link>
              <Link to="/register" className="block w-full text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all">Sign up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                #1 Telemedicine Platform
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                Your Digital <span className="text-blue-600">Healthcare Partner</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 sm:mt-5">
                Connect with top doctors, get digital prescriptions, and order medicines online - all from the comfort of your home.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg shadow-lg hover:shadow-xl transition-all">
                  Book Appointment
                </Link>
                <Link to="/find-doctors" className="inline-flex items-center justify-center px-8 py-3 border border-slate-200 dark:border-slate-700 text-base font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 md:py-4 md:text-lg transition-all">
                  Find Doctors
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">10k+ Patients</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
                  <span className="text-sm font-medium">Verified Doctors</span>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-xl lg:max-w-md overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="Doctor with patient"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Search Section */}
      <div className="bg-white dark:bg-slate-800 py-12 border-y border-slate-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Find the right doctor for you</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Search by specialization, name, or condition.</p>
            
            <div className="mt-8 relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                placeholder="Search doctors, specializations, symptoms..."
              />
              <button className="absolute inset-y-1 right-1 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Cardiologist', 'Dermatologist', 'Pediatrician', 'General Physician', 'Neurologist'].map((spec) => (
                <span key={spec} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer transition-colors">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Comprehensive Healthcare
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 dark:text-slate-400 mx-auto">
              Everything you need for your health, in one place.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: 'Online Consultation',
                  description: 'Connect with doctors instantly via chat or video call.',
                  icon: Video,
                  color: 'bg-blue-500'
                },
                {
                  name: 'Digital Prescriptions',
                  description: 'Get valid digital prescriptions directly on your phone.',
                  icon: FileText,
                  color: 'bg-emerald-500'
                },
                {
                  name: 'Medicine Delivery',
                  description: 'Order medicines from trusted pharmacies to your doorstep.',
                  icon: ShoppingBag,
                  color: 'bg-amber-500'
                },
                {
                  name: 'Book Appointments',
                  description: 'Schedule clinic visits with top specialists near you.',
                  icon: Calendar,
                  color: 'bg-purple-500'
                },
              ].map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-white dark:bg-slate-800 rounded-2xl px-6 pb-8 h-full shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                    <div className="-mt-6">
                      <div>
                        <span className={`inline-flex items-center justify-center p-3 ${feature.color} rounded-xl shadow-lg`}>
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-slate-900 dark:text-white tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-slate-500 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How It Works</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Get medical help in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
            
            {[
              { title: 'Search Doctor', desc: 'Find a specialist based on your needs.', step: '1' },
              { title: 'Book Appointment', desc: 'Choose a time slot that works for you.', step: '2' },
              { title: 'Get Treatment', desc: 'Consult online and get your prescription.', step: '3' },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-lg z-10 mb-6">
                  <span className="text-3xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Top Rated Doctors</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Consult with our most trusted specialists.</p>
            </div>
            <Link to="/find-doctors" className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-medium">
              View all doctors <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="aspect-w-3 aspect-h-2 bg-slate-200 dark:bg-slate-700 h-48 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1612349317150-b4636e56bccb' : i === 2 ? '1594824476969-23adf227d07e' : i === 3 ? '1622253637565-25db24354cfa' : '1612563815131-d146d6439f53'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`} 
                    alt="Doctor" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg shadow-sm flex items-center text-xs font-bold text-slate-900 dark:text-white">
                    <Star className="h-3 w-3 text-amber-400 mr-1 fill-current" />
                    4.9
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">Cardiologist</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">12 years experience • MBSS, MD</p>
                  <Link to="/login" className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium text-sm transition-colors">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/find-doctors" className="text-blue-600 font-medium">View all doctors →</Link>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-xl font-bold">100% Secure</h3>
              <p className="mt-2 text-blue-100">Your health data is encrypted and safe with us.</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-xl font-bold">Verified Doctors</h3>
              <p className="mt-2 text-blue-100">Every doctor is manually verified for your safety.</p>
            </div>
            <div className="flex flex-col items-center">
              <Activity className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="mt-2 text-blue-100">Our support team is always available to help you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">APNA HOSPITAL</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted partner in digital healthcare. Connecting you with the best doctors and pharmacies.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Find Doctors</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Video Consultations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Medicines</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Lab Tests</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-400 text-sm">
                  <Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center text-slate-400 text-sm">
                  <span className="mr-2">✉️</span> support@apnahospital.com
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} APNA HOSPITAL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
