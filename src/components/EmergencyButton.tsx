import React, { useState } from 'react';
import { Phone, AlertTriangle, X } from 'lucide-react';

export default function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-red-100 dark:border-red-900/30 p-6 w-80 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center text-red-600 dark:text-red-500">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="font-bold text-lg">Emergency Help</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
            If you are experiencing a medical emergency, please call emergency services immediately.
          </p>

          <div className="space-y-3">
            <a 
              href="tel:911" 
              className="flex items-center justify-center w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Ambulance (911)
            </a>
            <a 
              href="tel:+15551234567" 
              className="flex items-center justify-center w-full py-3 px-4 bg-white dark:bg-slate-700 border-2 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold transition-all"
            >
              <Phone className="h-5 w-5 mr-2" />
              Hospital Hotline
            </a>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center h-14 w-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
          aria-label="Emergency Help"
        >
          <AlertTriangle className="h-7 w-7 group-hover:animate-pulse" />
        </button>
      )}
    </div>
  );
}
