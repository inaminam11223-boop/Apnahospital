import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const res = await fetch('/api/prescriptions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setPrescriptions(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
      
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden sm:rounded-xl">
        <ul className="divide-y divide-slate-200">
          {prescriptions.map((p) => (
            <li key={p.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-600">
                  Dr. {p.doctor_name}
                </h3>
                <p className="text-sm text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
              </div>
              <p className="mt-1 text-sm text-slate-600">Diagnosis: {p.diagnosis}</p>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-slate-900">Medicines:</h4>
                <ul className="list-disc list-inside text-sm text-slate-500">
                  {p.medicines.map((m: any, idx: number) => (
                    <li key={idx}>{m.name} - {m.dosage}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 text-sm text-slate-500 italic">Instructions: {p.instructions}</p>
            </li>
          ))}
          {prescriptions.length === 0 && (
            <li className="px-4 py-8 sm:px-6 text-center text-slate-500 italic">No prescriptions found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
