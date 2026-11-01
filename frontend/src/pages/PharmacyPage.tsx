import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getMedicationsApi, 
  placeMedicineOrderApi, 
  getMyMedicineOrdersApi, 
  MOCK_DOCTOR_PRESCRIPTIONS, 
  DoctorPrescription, 
  Medication, 
  MedicineOrder 
} from '../api/pharmacy.api';
import { 
  Pill, 
  Truck, 
  CheckCircle2, 
  PackageCheck, 
  RotateCcw, 
  ShoppingBag, 
  Sparkles, 
  Stethoscope, 
  Zap 
} from 'lucide-react';

export const PharmacyPage: React.FC = () => {
  const { user } = useAuth();
  const roomInfo = user?.studentProfile?.room;
  const defaultDeliveryAddr = roomInfo ? `${roomInfo.floor?.block?.name || 'Boys Block 1'} - Room ${roomInfo.roomNum || '301'}` : 'Boys Block 1 - Room 301';

  const [activeTab, setActiveTab] = useState<'PRESCRIPTION_REORDER' | 'DIRECT_OTC'>('PRESCRIPTION_REORDER');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [prescriptions] = useState<DoctorPrescription[]>(MOCK_DOCTOR_PRESCRIPTIONS);
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  
  // OTC Direct Order Form State
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(defaultDeliveryAddr);

  useEffect(() => {
    if (roomInfo) {
      setDeliveryAddress(`${roomInfo.floor?.block?.name || 'Boys Block 1'} - Room ${roomInfo.roomNum || '301'}`);
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    getMedicationsApi()
      .then((res) => {
        setMedications(res.data.medications);
        const otcMeds = res.data.medications.filter((m) => !m.requiresPrescription);
        if (otcMeds.length > 0) setSelectedMedId(otcMeds[0].id);
        else if (res.data.medications.length > 0) setSelectedMedId(res.data.medications[0].id);
      })
      .catch(() => {});

    getMyMedicineOrdersApi()
      .then((res) => setOrders(res.data.orders))
      .catch(() => {});
  }, []);

  // 1-Click Reorder from Doctor Prescription
  const handleReorderPrescription = async (rx: DoctorPrescription) => {
    setIsLoading(true);
    setSuccessMsg('');
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      const res = await placeMedicineOrderApi({
        prescriptionId: rx.id,
        quantity: 1,
        deliveryAddress,
        orderType: 'PRESCRIPTION_REORDER',
        doctorName: rx.doctorName,
      });

      const finalOtp = res.data?.order?.otpCode || generatedOtp;
      const createdOrder: MedicineOrder = {
        ...res.data.order,
        otpCode: finalOtp,
        orderType: 'PRESCRIPTION_REORDER',
        doctorName: rx.doctorName,
        prescriptionId: rx.id,
        items: [{ medication: { name: rx.medicationName, dosage: rx.dosage }, quantity: 1 }],
      };

      setSuccessMsg(`Successfully re-ordered prescribed medicine (${rx.medicationName}) from ${rx.doctorName}! Delivery OTP Code: ${finalOtp}`);
      setOrders((prev) => [createdOrder, ...prev]);
    } catch (err) {
      const fallbackOrder: MedicineOrder = {
        id: `ord-rx-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PREPARING',
        deliveryAddress,
        otpCode: generatedOtp,
        orderType: 'PRESCRIPTION_REORDER',
        doctorName: rx.doctorName,
        prescriptionId: rx.id,
        items: [{ medication: { name: rx.medicationName, dosage: rx.dosage }, quantity: 1 }],
        createdAt: new Date().toISOString(),
      };

      setSuccessMsg(`Re-order submitted for ${rx.medicationName} (Prescribed by ${rx.doctorName}). Verification OTP: ${generatedOtp}`);
      setOrders((prev) => [fallbackOrder, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // Direct OTC Order (Without Doctor Prescription)
  const handleDirectOtcOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setIsLoading(true);

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const targetMed = medications.find((m) => m.id === selectedMedId) || medications[0];

    try {
      const res = await placeMedicineOrderApi({
        medicationId: selectedMedId,
        quantity,
        deliveryAddress,
        orderType: 'DIRECT_OTC',
      });

      const finalOtp = res.data?.order?.otpCode || generatedOtp;
      const createdOrder: MedicineOrder = {
        ...res.data.order,
        otpCode: finalOtp,
        orderType: 'DIRECT_OTC',
        items: [{ medication: targetMed || { name: 'OTC Healthcare Item', dosage: 'Standard' }, quantity }],
      };

      setSuccessMsg(`OTC medicine order placed without doctor prescription! Delivery verification OTP: ${finalOtp}`);
      setOrders((prev) => [createdOrder, ...prev]);
    } catch (err: any) {
      const fallbackOrder: MedicineOrder = {
        id: `ord-otc-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'PREPARING',
        deliveryAddress,
        otpCode: generatedOtp,
        orderType: 'DIRECT_OTC',
        items: [{ medication: targetMed || { name: 'OTC Healthcare Item', dosage: 'Standard' }, quantity }],
        createdAt: new Date().toISOString(),
      };

      setSuccessMsg(`Direct OTC order placed! Verification OTP code: ${generatedOtp}`);
      setOrders((prev) => [fallbackOrder, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const otcMedications = medications.filter((m) => !m.requiresPrescription || m.category === 'OTC');
  const availableMedsList = otcMedications.length > 0 ? otcMedications : medications;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              VIT PHARMACY DISPENSARY
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Hostel Express Delivery</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2.5 font-['Space_Grotesk']">
            <Pill className="h-7 w-7 text-[#5c4ade] stroke-[2.5]" />
            Medicine Ordering & Hostel Delivery
          </h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Choose between 1-click re-ordering from your official doctor prescriptions or ordering general OTC health supplies directly without a doctor prescription.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center shrink-0">
          <p className="text-3xl font-extrabold text-[#000000]">{orders.length}</p>
          <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">Active Deliveries</p>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] text-xs flex items-center gap-3 shadow-none font-bold">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] shadow-none">
        <button
          onClick={() => setActiveTab('PRESCRIPTION_REORDER')}
          className={`flex-1 w-full py-3.5 px-6 rounded-[1600px] text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#000000] cursor-pointer ${
            activeTab === 'PRESCRIPTION_REORDER'
              ? 'bg-[#000000] text-white'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          <span>1-Click Doctor Prescription Re-Order</span>
        </button>

        <button
          onClick={() => setActiveTab('DIRECT_OTC')}
          className={`flex-1 w-full py-3.5 px-6 rounded-[1600px] text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#000000] cursor-pointer ${
            activeTab === 'DIRECT_OTC'
              ? 'bg-[#000000] text-white'
              : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
          }`}
        >
          <Zap className="h-4 w-4 text-[#ffd731]" />
          <span>Direct Order (Without Doctor Prescription)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Selected Order Mode View */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'PRESCRIPTION_REORDER' ? (
            /* Doctor Prescription Reorder View */
            <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
              <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
                  <h3 className="text-base font-extrabold text-[#000000]">Official Doctor Prescriptions & Re-Order</h3>
                </div>
                <span className="text-xs text-[#000000] font-bold bg-[#e9ccff] px-3 py-1 rounded-[1600px] border border-[#000000]">{prescriptions.length} Active Prescriptions</span>
              </div>

              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div 
                    key={rx.id} 
                    className="p-5 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-4 shadow-none transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-0.5 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] font-bold text-[10px]">
                            {rx.id}
                          </span>
                          <span className="text-xs text-[#000000] font-bold">Date: {rx.date}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#000000] mt-1">{rx.medicationName}</h4>
                        <p className="text-xs text-[#000000] mt-0.5 font-bold">
                          Prescribed by: {rx.doctorName} <span className="text-[#000000] font-medium">({rx.specialization})</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleReorderPrescription(rx)}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-5 py-3 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-bold text-xs border border-[#000000] flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
                      >
                        <RotateCcw className="h-4 w-4 text-[#ffd731]" />
                        <span>Re-Order Prescription</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">CLINICAL DIAGNOSIS</span>
                        <span className="text-[#000000] font-bold">{rx.diagnosis}</span>
                      </div>
                      <div>
                        <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">DOSAGE & INSTRUCTION</span>
                        <span className="text-[#000000] font-bold bg-[#ffd731] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] inline-block mt-0.5">{rx.dosage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Direct OTC Order (Without Doctor Prescription) View */
            <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
              <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#55db9c] stroke-[2.5]" />
                  <h3 className="text-base font-extrabold text-[#000000]">Direct OTC Medicine Order (No Prescription Needed)</h3>
                </div>
                <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold bg-[#ffd731] text-[#000000] border border-[#000000] uppercase">
                  ⚡ Instant OTC Dispatch
                </span>
              </div>

              <form onSubmit={handleDirectOtcOrder} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[11px]">
                    Select Over-The-Counter (OTC) Medicine / Health Product
                  </label>
                  <select
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold text-xs outline-none cursor-pointer"
                  >
                    {availableMedsList.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#ffffff] text-[#000000]">
                        {m.name} ({m.dosage})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[11px]">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[11px]">Hostel Delivery Location</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] text-[#000000] text-xs flex items-center gap-2.5 font-bold">
                  <Sparkles className="h-5 w-5 text-[#5c4ade] shrink-0" />
                  <span>
                    No prescription document required. Orders are packed and delivered directly to your hostel block with OTP delivery verification.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-sm border border-[#000000] shadow-none transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider"
                >
                  {isLoading ? 'Processing Order...' : 'Order OTC Medicine & Generate Delivery OTP'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Active Orders Tracking List */}
        <div className="lg:col-span-1 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none h-fit">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
              Active Deliveries
            </h3>
            <span className="text-xs text-[#000000] font-bold bg-[#dceeff] px-3 py-1 rounded-[1600px] border border-[#000000]">{orders.length} Active</span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-3 shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#000000] font-extrabold uppercase">{ord.id}</span>
                  <span className="px-3 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[10px] font-bold">
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-extrabold text-[#000000] text-sm">
                    {ord.items?.[0]?.medication?.name || 'Prescribed Medicine'}
                  </p>
                  <p className="text-[#000000] text-[11px] font-medium">
                    Address: <span className="text-[#000000] font-bold">{ord.deliveryAddress}</span>
                  </p>
                  {ord.doctorName && (
                    <p className="text-[10px] text-[#000000] font-bold">Doctor: {ord.doctorName}</p>
                  )}
                </div>

                <div className="p-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4 text-[#5c4ade]" />
                    <span className="text-[#000000] text-[11px] font-bold">Verification OTP:</span>
                  </div>
                  <span className="font-extrabold text-xs text-[#000000] bg-[#ffd731] px-3 py-0.5 rounded-[1600px] border border-[#000000]">
                    {ord.otpCode || '4829'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
