import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setOrders(data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Pharmacy Dashboard</h1>
      
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden sm:rounded-xl">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">Incoming Orders</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          {orders.map((o) => (
            <li key={o.id} className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-600 truncate">
                  Order #{o.id} - {o.patient_name}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {o.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-slate-500">
                    Date: {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {orders.length === 0 && (
            <li className="px-4 py-8 sm:px-6 text-center text-slate-500 italic">No orders found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

