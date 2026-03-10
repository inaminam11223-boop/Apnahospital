import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar as CalendarIcon, Clock, User, Video, Edit2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface TimeSlot {
  start: string;
  end: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  fees: number;
  availability?: {
    [key: string]: TimeSlot[];
  };
}

interface Appointment {
  id: number;
  doctor_name?: string;
  patient_name?: string;
  date: string;
  time_slot: string;
  status: string;
  meeting_link?: string;
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [editingLink, setEditingLink] = useState<{id: number, link: string} | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    fetchAppointments();
    if (user?.role === 'patient') {
      fetchDoctors();
    }
  }, [user]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setAppointments(data);
  };

  const fetchDoctors = async () => {
    const res = await fetch('/api/doctors', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setDoctors(data);
  };

  const generateTimeSlots = (start: string, end: string) => {
    const slots = [];
    let current = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    while (current < endTime) {
      const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 30); // 30 min slots
    }
    return slots;
  };

  const fetchAvailableSlots = async () => {
    const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));
    if (!doctor || !doctor.availability) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayName = format(selectedDate, 'EEEE'); // e.g., Monday
    const daySlots = doctor.availability[dayName] || [];

    if (daySlots.length === 0) {
      setAvailableSlots([]);
      return;
    }

    // Fetch booked slots
    const res = await fetch(`/api/appointments/check?doctor_id=${selectedDoctor}&date=${dateStr}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const bookedSlots: string[] = await res.json();

    // Generate all possible slots from ranges
    let allSlots: string[] = [];
    daySlots.forEach(slot => {
      const generated = generateTimeSlots(slot.start, slot.end);
      allSlots = [...allSlots, ...generated];
    });

    // Filter out booked slots
    const available = allSlots.filter(slot => !bookedSlots.includes(slot));
    setAvailableSlots(available);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        doctor_id: selectedDoctor, 
        date: format(selectedDate, 'yyyy-MM-dd'), 
        time_slot: time, 
        notes 
      })
    });
    fetchAppointments();
    // Reset form
    setSelectedDoctor('');
    setTime('');
    setNotes('');
    setAvailableSlots([]);
  };

  const updateAppointment = async (id: number, status: string, meeting_link?: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status, meeting_link })
    });
    fetchAppointments();
    setEditingLink(null);
  };

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
      </div>

      {user?.role === 'patient' && (
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 sm:rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Book New Appointment
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: Select Doctor */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">1. Select Doctor</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {doctors.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id.toString())}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedDoctor === doc.id.toString()
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{doc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{doc.specialization} • ${doc.fees}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Date */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">2. Select Date</label>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <button onClick={prevWeek} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                    <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {format(currentWeekStart, 'MMMM yyyy')}
                  </span>
                  <button onClick={nextWeek} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                    <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="text-xs text-slate-400 font-medium mb-2">{d}</div>
                  ))}
                  {weekDays.map(day => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    return (
                      <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : isTodayDate
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Select Time & Book */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">3. Select Time</label>
              {!selectedDoctor ? (
                <div className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                  Please select a doctor first.
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`py-2 px-1 text-xs rounded-lg border transition-all ${
                        time === slot
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center border border-amber-100 dark:border-amber-900/30">
                  No slots available for this date.
                </div>
              )}

              {time && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                  <input 
                    type="text" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes (optional)..."
                    className="w-full mb-3 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button 
                    onClick={handleBook}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sm:rounded-xl">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Upcoming Appointments</h3>
        </div>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {appointments.map((apt) => (
            <li key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                    {user?.role === 'patient' ? `Dr. ${apt.doctor_name}` : `Patient: ${apt.patient_name}`}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                      'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {apt.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between items-center">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                      {apt.date}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-slate-500 dark:text-slate-400 sm:mt-0 sm:ml-6">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-slate-400" />
                      {apt.time_slot}
                    </p>
                  </div>
                  
                  {/* Actions Area */}
                  <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                    
                    {/* Patient Actions */}
                    {user?.role === 'patient' && apt.status === 'confirmed' && (
                      <div className="flex items-center">
                        {apt.meeting_link ? (
                           <a href={apt.meeting_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                             <Video className="flex-shrink-0 mr-1.5 h-5 w-5" />
                             Join Meeting
                           </a>
                        ) : (
                           <Link to={`/video/${apt.id}`} className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                             <Video className="flex-shrink-0 mr-1.5 h-5 w-5" />
                             Join Video Call
                           </Link>
                        )}
                      </div>
                    )}

                    {/* Doctor Actions */}
                    {user?.role === 'doctor' && (
                      <div className="flex flex-col items-end space-y-2">
                        {apt.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateAppointment(apt.id, 'confirmed')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateAppointment(apt.id, 'cancelled')}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                        
                        {apt.status === 'confirmed' && (
                          <div className="flex items-center space-x-2">
                             {editingLink?.id === apt.id ? (
                               <div className="flex items-center space-x-2">
                                 <input 
                                   type="text" 
                                   value={editingLink.link}
                                   onChange={(e) => setEditingLink({...editingLink, link: e.target.value})}
                                   className="border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                   placeholder="https://..."
                                 />
                                 <button 
                                   onClick={() => updateAppointment(apt.id, 'confirmed', editingLink.link)}
                                   className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                                   title="Save"
                                 >
                                   <Check className="h-4 w-4" />
                                 </button>
                                 <button 
                                   onClick={() => setEditingLink(null)}
                                   className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                   title="Cancel"
                                 >
                                   <X className="h-4 w-4" />
                                 </button>
                               </div>
                             ) : (
                               <div className="flex items-center space-x-2">
                                 {apt.meeting_link ? (
                                   <a href={apt.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 flex items-center">
                                     <Video className="h-4 w-4 mr-1" /> Link
                                   </a>
                                 ) : (
                                   <Link to={`/video/${apt.id}`} className="text-blue-600 hover:underline dark:text-blue-400 flex items-center">
                                     <Video className="h-4 w-4 mr-1" /> Internal
                                   </Link>
                                 )}
                                 <button 
                                   onClick={() => setEditingLink({id: apt.id, link: apt.meeting_link || ''})}
                                   className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 ml-2"
                                   title="Edit Link"
                                 >
                                   <Edit2 className="h-4 w-4" />
                                 </button>
                               </div>
                             )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {appointments.length === 0 && (
            <li className="px-4 py-8 sm:px-6 text-center text-slate-500 dark:text-slate-400 italic">No appointments found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
