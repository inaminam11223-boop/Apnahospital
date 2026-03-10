import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Activity, 
  Search, 
  Clock, 
  MapPin, 
  Video, 
  ShoppingBag, 
  AlertCircle,
  ChevronRight,
  Pill,
  Stethoscope,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [apptRes, prescRes, orderRes] = await Promise.all([
          fetch('/api/appointments', { headers }),
          fetch('/api/prescriptions', { headers }),
          fetch('/api/orders', { headers })
        ]);

        if (apptRes.ok) setAppointments(await apptRes.json());
        if (prescRes.ok) setPrescriptions(await prescRes.json());
        if (orderRes.ok) setOrders(await orderRes.json());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
  const recentPrescription = prescriptions.length > 0 ? prescriptions[prescriptions.length - 1] : null;
  const activeOrder = orders.find(o => o.status !== 'delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your health summary.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            to="/find-doctors" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Find a Doctor
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Upcoming Appointment Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Upcoming
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {nextAppointment ? `Dr. ${nextAppointment.doctor_name}` : 'No Upcoming'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {nextAppointment 
                ? `${format(new Date(nextAppointment.date), 'MMM d, yyyy')} • ${nextAppointment.time_slot}` 
                : 'Schedule a consultation'}
            </p>
          </div>
          {nextAppointment && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Link to="/dashboard/appointments" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent Prescription Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Prescriptions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {recentPrescription 
                ? `Last from Dr. ${recentPrescription.doctor_name}` 
                : 'No recent prescriptions'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/dashboard/prescriptions" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center">
              View History <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Active Order Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            {activeOrder && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 capitalize">
                {activeOrder.status}
              </span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Medicine Orders</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeOrder 
                ? `Order #${activeOrder.id} in progress` 
                : 'No active orders'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/dashboard/orders" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 flex items-center">
              Track Order <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Health Reminders Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              2 Alerts
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Health Reminders</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Daily check-up pending
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/dashboard/symptom-checker" className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center">
              Check Symptoms <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Appointments & Prescriptions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Appointments</h3>
              <Link to="/dashboard/appointments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                        {appt.doctor_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Dr. {appt.doctor_name}</p>
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(appt.date), 'MMM d, yyyy')}
                          <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                          {appt.time_slot}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {appt.meeting_link && (
                        <a 
                          href={appt.meeting_link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Video className="h-3.5 w-3.5 mr-1.5" />
                          Join
                        </a>
                      )}
                      <button className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p>No upcoming appointments scheduled.</p>
                  <Link to="/find-doctors" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">Find a doctor</Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Prescriptions</h3>
              <Link to="/dashboard/prescriptions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View history</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {prescriptions.length > 0 ? (
                prescriptions.slice(0, 3).map((presc) => (
                  <div key={presc.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Dr. {presc.doctor_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {format(new Date(presc.date), 'MMM d, yyyy')} • {presc.diagnosis}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <FileText className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p>No prescriptions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Find Doctors */}
        <div className="space-y-8">
          {/* Find Doctors Widget */}
          <div className="bg-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need a Specialist?</h3>
              <p className="text-blue-100 mb-6 text-sm">Find top-rated doctors and book an appointment instantly.</p>
              
              <div className="space-y-3">
                <Link to="/find-doctors?specialization=Cardiologist" className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 transition-colors flex items-center">
                  <Heart className="h-5 w-5 mr-3 text-blue-200" />
                  <span className="text-sm font-medium">Cardiologist</span>
                </Link>
                <Link to="/find-doctors?specialization=Dermatologist" className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 transition-colors flex items-center">
                  <Activity className="h-5 w-5 mr-3 text-blue-200" />
                  <span className="text-sm font-medium">Dermatologist</span>
                </Link>
                <Link to="/find-doctors?specialization=General Physician" className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-3 transition-colors flex items-center">
                  <Stethoscope className="h-5 w-5 mr-3 text-blue-200" />
                  <span className="text-sm font-medium">General Physician</span>
                </Link>
              </div>

              <Link to="/find-doctors" className="mt-6 w-full block text-center bg-white text-blue-600 font-medium py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                View All Doctors
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/dashboard/records" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Upload Report</span>
              </Link>
              <Link to="/dashboard/orders" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Pill className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Order Meds</span>
              </Link>
              <Link to="/dashboard/symptom-checker" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Symptoms</span>
              </Link>
              <Link to="/find-doctors" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Search</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
