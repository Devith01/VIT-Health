import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Pill, Clock } from 'lucide-react';

export const PharmacyDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [orders, setOrders] = useState([
    {
      id: 'ord-demo-101',
      studentName: 'Aarav Patel',
      deliveryAddress: 'Boys Hostel 1 - Block A - Floor 3 - Room 301',
      medicationName: 'ORS Electrolyte Sachet (2 Packs)',
      status: 'PREPARING',
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: '10 mins ago',
    },
    {
      id: 'ord-demo-102',
      studentName: 'Rohan Sharma',
      deliveryAddress: 'Boys Hostel 1 - Block A - Floor 3 - Room 302',
      medicationName: 'Paracetamol 500mg (1 Strip)',
      status: 'PENDING',
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: '25 mins ago',
    },
  ]);

  const [inventory] = useState([
    { name: 'ORS Electrolyte Sachet', stock: 120, status: 'IN_STOCK' },
    { name: 'Paracetamol 500mg', stock: 450, status: 'IN_STOCK' },
    { name: 'Azithromycin 500mg', stock: 15, status: 'LOW_STOCK' },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              CAMPUS PHARMACY DESK
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Staff Code: PHARM-202</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Prescription Dispensing & Delivery Workflow</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Process doctor-prescribed medicine orders, check stock availability, manage preparation pipelines, and verify hostel OTP deliveries.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center shrink-0">
          <p className="text-3xl font-extrabold text-[#000000]">{orders.length}</p>
          <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">Active Orders</p>
        </div>
      </div>

      {/* Sub-Route Specific Views */}

      {path.includes('/inventory') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Pill className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
            Medication Stock Inventory Manager
          </h3>
          <div className="space-y-3 text-xs">
            {inventory.map((item) => (
              <div key={item.name} className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-[#000000] text-sm">{item.name}</p>
                  <p className="text-[#000000] font-bold">Stock Level: {item.stock} Units</p>
                </div>
                <span className={`px-3 py-1 rounded-[1600px] text-xs font-bold border border-[#000000] ${
                  item.status === 'IN_STOCK' ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#ffd731] text-[#000000]'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {path.includes('/history') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
            Dispensed Order History Log
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2">
            <div className="flex justify-between items-center font-bold text-[#000000]">
              <span>Order #ord-demo-099 (Aarav Patel)</span>
              <span className="text-[#000000] bg-[#55db9c] px-3 py-0.5 rounded-[1600px] border border-[#000000] text-[10px]">DELIVERED</span>
            </div>
            <p className="text-[#000000] font-medium">Delivered to Block A Room 301. Verified with dynamic delivery OTP.</p>
          </div>
        </div>
      )}

      {/* Main Order Workflow Pipeline (Shown on Dashboard, Orders, Prescriptions, Delivery routes) */}
      {(path.includes('/dashboard') || path.includes('/orders') || path.includes('/prescriptions') || path.includes('/delivery') || path === '/pharmacy') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Pill className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
              Hostel Medicine Delivery Orders
            </h3>
            <span className="text-xs font-bold text-[#000000] bg-[#ffd731] px-3 py-1 rounded-[1600px] border border-[#000000]">OTP Verification Active</span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-4 shadow-none"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#000000] text-sm">{ord.medicationName}</span>
                      <span className="text-xs font-bold text-[#000000] bg-[#ffffff] px-2.5 py-0.5 rounded-[1600px] border border-[#000000]">
                        {ord.id}
                      </span>
                    </div>
                    <p className="text-xs text-[#000000] mt-1 font-medium">
                      Student: <strong className="text-[#000000] font-bold">{ord.studentName}</strong> ({ord.deliveryAddress})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000]">
                      OTP: {ord.otpCode}
                    </span>
                    <span className="px-3 py-1 rounded-[1600px] text-xs font-bold bg-[#55db9c] text-[#000000] border border-[#000000]">
                      {ord.status}
                    </span>
                  </div>
                </div>

                {/* Status Pipeline Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                  {['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(ord.id, st)}
                      className={`py-2 px-3 rounded-[1600px] border border-[#000000] font-bold transition-all text-[10px] cursor-pointer ${
                        ord.status === st
                          ? 'bg-[#000000] text-white'
                          : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
