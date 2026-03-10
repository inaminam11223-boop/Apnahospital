import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function OrderMedicines() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchPrescriptions();
    fetchPharmacies();
    fetchOrders();
  }, []);

  const fetchPrescriptions = async () => {
    const res = await fetch('/api/prescriptions', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setPrescriptions(data);
  };

  const fetchPharmacies = async () => {
    const res = await fetch('/api/pharmacies', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setPharmacies(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setOrders(data);
  };

  const handleOrder = async (prescriptionId: number) => {
    if (!selectedPharmacy) {
      alert('Please select a pharmacy');
      return;
    }

    await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        pharmacy_id: selectedPharmacy, 
        prescription_id: prescriptionId 
      })
    });
    fetchOrders();
    alert('Order placed successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Medicines</h1>

      <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">New Order from Prescription</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700">Select Pharmacy</label>
          <select 
            value={selectedPharmacy} 
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all"
          >
            <option value="">Choose a pharmacy...</option>
            {pharmacies.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <ul className="divide-y divide-slate-200">
          {prescriptions.map((p) => (
            <li key={p.id} className="py-4 flex justify-between items-center hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">Prescription from Dr. {p.doctor_name}</p>
                <p className="text-sm text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => handleOrder(p.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md"
              >
                Order Now
              </button>
            </li>
          ))}
          {prescriptions.length === 0 && <p className="text-slate-500 italic">No prescriptions available.</p>}
        </ul>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 sm:rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">My Orders</h2>
        <ul className="divide-y divide-slate-200">
          {orders.map((o) => (
            <li key={o.id} className="py-4 hover:bg-slate-50 transition-colors px-2 -mx-2 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Order #{o.id}</p>
                  <p className="text-sm text-slate-500">Pharmacy: {o.pharmacy_name || 'Pending Assignment'}</p>
                </div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {o.status}
                </span>
              </div>
            </li>
          ))}
          {orders.length === 0 && <p className="text-slate-500 italic">No orders found.</p>}
        </ul>
      </div>
    </div>
  );
}
