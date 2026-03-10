import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Activity, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, apptRes] = await Promise.all([
          fetch('/api/profile', { headers }),
          fetch('/api/appointments', { headers })
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.profile);
        }
        if (apptRes.ok) {
          setAppointments(await apptRes.json());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => a.date === today);
  const upcomingAppointments = appointments.filter(a => a.date > today && a.status !== 'cancelled');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Verification Status Banner */}
      {profile?.verification_status === 'pending' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700 dark:text-amber-200">
                Your account is currently <strong>Pending Verification</strong>. You will not be visible to patients until an admin verifies your credentials.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {profile?.verification_status === 'rejected' && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                Your account verification was <strong>Rejected</strong>. Please contact support for more information.
              </p>
            </div>
          </div>
        </div>
      )}

      {profile?.verification_status === 'verified' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-emerald-700 dark:text-emerald-200">
                Your account is <strong>Verified</strong> and active.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Doctor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your practice and patients.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {profile?.specialization || 'General Practitioner'}
          </span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Today's Appointments</dt>
                  <dd>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{todaysAppointments.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Pending Requests</dt>
                  <dd>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{pendingAppointments.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Earnings</dt>
                  <dd>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">$0.00</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Patients</dt>
                  <dd>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">0</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Appointments</h3>
            <Link to="/dashboard/appointments" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                      {appt.patient_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{appt.patient_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(appt.date), 'MMM d, yyyy')} • {appt.time_slot}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p>No upcoming appointments.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/appointments" className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Manage Schedule</span>
              </Link>
              <Link to="/dashboard/prescriptions" className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Write Prescription</span>
              </Link>
              <Link to="/dashboard/messages" className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Patient Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
