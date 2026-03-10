import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  Settings,
  ShoppingBag,
  Users,
  Activity,
  Image,
  MessageSquare,
  Bell,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Plus
} from 'lucide-react';
import PatientDashboard from './dashboard/PatientDashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';
import PharmacyDashboard from './dashboard/PharmacyDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import Appointments from './dashboard/Appointments';
import Prescriptions from './dashboard/Prescriptions';
import Profile from './dashboard/Profile';
import OrderMedicines from './dashboard/OrderMedicines';
import SymptomChecker from './dashboard/SymptomChecker';
import IllustrationGenerator from './dashboard/IllustrationGenerator';
import FindDoctors from './FindDoctors';

// Placeholder components for new features
const MedicalRecords = () => <div className="p-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Records</h2><p className="text-slate-500 dark:text-slate-400 mt-2">Manage your medical history and reports here.</p></div>;
const Messages = () => <div className="p-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h2><p className="text-slate-500 dark:text-slate-400 mt-2">Chat with your doctors.</p></div>;
const Notifications = () => <div className="p-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2><p className="text-slate-500 dark:text-slate-400 mt-2">View your alerts and reminders.</p></div>;
const FavoriteDoctors = () => <div className="p-6"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Favorite Doctors</h2><p className="text-slate-500 dark:text-slate-400 mt-2">Your saved doctors list.</p></div>;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getNavItems = () => {
    const common = [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/dashboard/profile', icon: User },
    ];

    switch (user?.role) {
      case 'patient':
        return [
          ...common,
          { name: 'Find Doctors', path: '/dashboard/find-doctors', icon: Search },
          { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
          { name: 'Prescriptions', path: '/dashboard/prescriptions', icon: FileText },
          { name: 'Order Medicines', path: '/dashboard/orders', icon: ShoppingBag },
          { name: 'Medical Records', path: '/dashboard/records', icon: FileText },
          { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
          { name: 'Symptom Checker', path: '/dashboard/symptom-checker', icon: Activity },
        ];
      case 'doctor':
        return [
          ...common,
          { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
          { name: 'Prescriptions', path: '/dashboard/prescriptions', icon: FileText },
          { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
        ];
      case 'pharmacy':
        return [
          ...common,
          { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
        ];
      case 'admin':
        return [
          ...common,
          { name: 'Users', path: '/dashboard/users', icon: Users },
          { name: 'Reports', path: '/dashboard/reports', icon: FileText },
          { name: 'Illustrations', path: '/dashboard/illustrations', icon: Image },
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">APNA HOSPITAL</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
            >
              {theme === 'dark' ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex ml-4 relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                placeholder="Search doctors, appointments..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user?.role === 'patient' && (
              <Link 
                to="/dashboard/appointments" 
                className="hidden sm:flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Book Appointment
              </Link>
            )}

            <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <div className="flex items-center cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:block ml-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user?.name}
                </span>
                <ChevronDown className="hidden sm:block ml-1 h-4 w-4 text-slate-400" />
              </div>
              
              {isProfileOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Your Profile</Link>
                  <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                user?.role === 'patient' ? <PatientDashboard /> :
                user?.role === 'doctor' ? <DoctorDashboard /> :
                user?.role === 'pharmacy' ? <PharmacyDashboard /> :
                <AdminDashboard />
              } />
              <Route path="appointments" element={<Appointments />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="orders" element={<OrderMedicines />} />
              <Route path="profile" element={<Profile />} />
              <Route path="symptom-checker" element={<SymptomChecker />} />
              <Route path="illustrations" element={<IllustrationGenerator />} />
              <Route path="records" element={<MedicalRecords />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="favorites" element={<FavoriteDoctors />} />
              <Route path="find-doctors" element={<FindDoctors />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
