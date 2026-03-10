import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Clock, Save, User, Phone, MapPin, DollarSign, Briefcase } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setProfile(data);
    setFormData({
      ...data.profile,
      availability: data.profile?.availability || {}
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });
    setIsEditing(false);
    fetchProfile();
  };

  const addTimeSlot = (day: string) => {
    const currentSlots = formData.availability?.[day] || [];
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: [...currentSlots, { start: '09:00', end: '17:00' }]
      }
    });
  };

  const removeTimeSlot = (day: string, index: number) => {
    const currentSlots = [...(formData.availability?.[day] || [])];
    currentSlots.splice(index, 1);
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: currentSlots
      }
    });
  };

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    const currentSlots = [...(formData.availability?.[day] || [])];
    currentSlots[index] = { ...currentSlots[index], [field]: value };
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: currentSlots
      }
    });
  };

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">User Profile</h3>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information and settings.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isEditing 
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={formData.phone || ''} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="pl-10 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={formData.address || ''} 
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="pl-10 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="123 Medical Center Dr"
                    />
                  </div>
                </div>
              </div>
            </div>

            {user?.role === 'doctor' && (
              <>
                <div className="border-t border-slate-100 pt-8">
                  <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                    Professional Details
                  </h4>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                      <input 
                        type="text" 
                        value={formData.specialization || ''} 
                        onChange={e => setFormData({...formData, specialization: e.target.value})}
                        className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. Cardiologist"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fees ($)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        </div>
                        <input 
                          type="number" 
                          value={formData.fees || ''} 
                          onChange={e => setFormData({...formData, fees: e.target.value})}
                          className="pl-10 block w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-medium text-slate-800 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      Weekly Availability
                    </h4>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      Set your working hours
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {days.map(day => (
                      <div key={day} className="border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-xl">
                          <h5 className="font-semibold text-slate-700">{day}</h5>
                          <button
                            type="button"
                            onClick={() => addTimeSlot(day)}
                            className="p-1.5 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Add time slot"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-4 space-y-3 min-h-[100px]">
                          {(formData.availability?.[day] || []).map((slot: any, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                              <input
                                type="time"
                                value={slot.start}
                                onChange={e => updateTimeSlot(day, idx, 'start', e.target.value)}
                                className="block w-full border-slate-200 rounded-md text-xs py-1 px-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <span className="text-slate-400 text-xs">-</span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={e => updateTimeSlot(day, idx, 'end', e.target.value)}
                                className="block w-full border-slate-200 rounded-md text-xs py-1 px-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeTimeSlot(day, idx)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          {(formData.availability?.[day] || []).length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-2">
                              <span className="text-xs italic">Unavailable</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button 
                type="submit" 
                className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Full name</dt>
              <dd className="mt-1 text-sm text-slate-900 font-medium">{profile.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Email address</dt>
              <dd className="mt-1 text-sm text-slate-900">{profile.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Role</dt>
              <dd className="mt-1 text-sm text-slate-900 capitalize">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                  profile.role === 'patient' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {profile.role}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 text-sm text-slate-900">{profile.profile?.phone || '-'}</dd>
            </div>
            {profile.profile?.specialization && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Specialization</dt>
                <dd className="mt-1 text-sm text-slate-900">{profile.profile.specialization}</dd>
              </div>
            )}
            {profile.profile?.fees && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-slate-500">Consultation Fees</dt>
                <dd className="mt-1 text-sm text-slate-900">${profile.profile.fees}</dd>
              </div>
            )}
            
            {user?.role === 'doctor' && profile.profile?.availability && (
               <div className="sm:col-span-2 border-t border-slate-100 pt-6">
                 <dt className="text-base font-medium text-slate-800 mb-4">Weekly Availability</dt>
                 <dd className="mt-1 text-sm text-slate-900">
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {Object.entries(profile.profile.availability).map(([day, slots]: [string, any]) => (
                       slots.length > 0 && (
                         <div key={day} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                           <span className="font-semibold text-slate-700 block mb-2">{day}</span>
                           <div className="space-y-1">
                             {slots.map((s: any, i: number) => (
                               <div key={i} className="flex items-center text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-100">
                                 <Clock className="w-3 h-3 mr-1.5 text-blue-500" />
                                 {s.start} - {s.end}
                               </div>
                             ))}
                           </div>
                         </div>
                       )
                     ))}
                   </div>
                 </dd>
               </div>
            )}
          </dl>
        )}
      </div>
    </div>
  );
}
