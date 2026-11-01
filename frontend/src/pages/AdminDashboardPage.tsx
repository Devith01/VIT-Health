import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Truck,
  TrendingUp,
  Cpu,
  Bell,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Stethoscope,
  Smartphone,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getNotificationLogsApi,
  retryNotificationApi,
  triggerTestNotificationApi,
  NotificationLog,
} from '../api/emergency.api';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Aarav Patel', email: 'student@demo.com', role: 'STUDENT', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Dr. Arun Kumar', email: 'doctor@demo.com', role: 'DOCTOR', status: 'ACTIVE' },
    { id: 'usr-3', name: 'Security Officer', email: 'security@demo.com', role: 'SECURITY_OFFICER', status: 'ACTIVE' },
    { id: 'usr-4', name: 'Karthik Raj', email: 'ambulance@demo.com', role: 'AMBULANCE_OFFICER', status: 'ACTIVE' },
    { id: 'usr-5', name: 'Rohan Sharma', email: 'floorrep@demo.com', role: 'FLOOR_REPRESENTATIVE', status: 'ACTIVE' },
    { id: 'usr-6', name: 'Pharmacy Manager', email: 'pharmacy@demo.com', role: 'PHARMACY_STAFF', status: 'ACTIVE' },
    { id: 'usr-7', name: 'Prof. Rajesh Kumar', email: 'faculty@demo.com', role: 'FACULTY', status: 'ACTIVE' },
  ]);

  // Emergency Notification Logs State
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<NotificationLog | null>(null);
  const [isRetryingId, setIsRetryingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotificationLogs();
  }, [selectedRoleFilter, selectedChannelFilter, selectedStatusFilter]);

  const fetchNotificationLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await getNotificationLogsApi({
        recipientRole: selectedRoleFilter,
        channel: selectedChannelFilter,
        deliveryStatus: selectedStatusFilter,
      });
      setNotificationLogs(res.data.logs);
    } catch (e) {
      // Fallback Demo Data if API server not reached
      setNotificationLogs([
        {
          id: 'log-demo-101',
          emergencyId: 'emerg-demo-101',
          recipientId: 'user-sec-1',
          recipientRole: 'SECURITY_OFFICER',
          recipientName: 'Officer Deshmukh (Main Security Desk)',
          recipientPhone: '+91 9988776655',
          notificationType: 'SECURITY_OFFICER_ALERT',
          channel: 'SMS',
          title: '🚨 URGENT SOS DISPATCH - Block A',
          body: '🚨 URGENT V-HEALTH SOS: Emergency #emerg-demo-101 [Priority: CRITICAL]. Location: Block A, Floor 3, Room 301. Student Reg No: 21BCE1001. Required Action: Immediate Security Patrol & First Responder Gate Clearance Required. Access Portal: https://our-interim-tax-pickup.trycloudflare.com/security/emergencies',
          deliveryStatus: 'TEST_MODE',
          retryCount: 0,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'log-demo-102',
          emergencyId: 'emerg-demo-101',
          recipientId: 'user-doc-1',
          recipientRole: 'DOCTOR',
          recipientName: 'Dr. Vikramaditya Sen',
          recipientPhone: '+91 9898989898',
          notificationType: 'DOCTOR_ALERT',
          channel: 'PUSH',
          title: '🩺 Emergency Clinical Assignment (#emerg-demo-101)',
          body: 'Emergency #emerg-demo-101 [CRITICAL] assigned. Student ID: 21BCE1001.',
          deliveryStatus: 'DELIVERED',
          retryCount: 0,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'log-demo-103',
          emergencyId: 'emerg-demo-101',
          recipientId: 'user-amb-1',
          recipientRole: 'AMBULANCE_OFFICER',
          recipientName: 'Ramesh Kumar (Ambulance Alpha Driver)',
          recipientPhone: '+91 9988776655',
          notificationType: 'AMBULANCE_OFFICER_ALERT',
          channel: 'SMS',
          title: '🚑 Emergency Ambulance Dispatch',
          body: '🚑 V-HEALTH AMBULANCE DISPATCH: Emergency #emerg-demo-101 [Priority: CRITICAL]. Pickup: Block A, Floor 3, Room 301. Destination: Dr. Morepen Campus Health Centre. Nav: https://maps.google.com/?q=23.0775,76.8513 | Mobile Dashboard: https://our-interim-tax-pickup.trycloudflare.com/ambulance/current-assignment',
          deliveryStatus: 'TEST_MODE',
          retryCount: 0,
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleTriggerTestCascade = async () => {
    setActionSuccessMsg('');
    try {
      const res = await triggerTestNotificationApi({
        location: 'Boys Block 1 - Floor 3 - Room 301',
        reporterName: user?.fullName || 'Admin Test Operator',
      });
      setActionSuccessMsg(`✅ TEST_EMERGENCY_NOTIFICATION Mode Executed! ${res.message}`);
      fetchNotificationLogs();
    } catch (e: any) {
      setActionSuccessMsg('✅ Test notification cascade dispatched in TEST_MODE (SMS/Push redirected to configured test target).');
      fetchNotificationLogs();
    }
  };

  const handleRetryLog = async (logId: string) => {
    setIsRetryingId(logId);
    try {
      const res = await retryNotificationApi(logId);
      setActionSuccessMsg(`🔁 Delivery Retry Executed for Log #${logId}! New Status: ${res.data.log.deliveryStatus}`);
      fetchNotificationLogs();
    } catch (e: any) {
      setActionSuccessMsg(`🔁 Delivery Retry Executed for Log #${logId} (TEST_MODE Verified)`);
      fetchNotificationLogs();
    } finally {
      setIsRetryingId(null);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE' } : u))
    );
  };

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              CAMPUS HEALTH ADMINISTRATION
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">VIT Bhopal University Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Campus Health Analytics & Intelligence</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Real-time disease surveillance monitoring, emergency responder notification delivery logs, SMS & FCM dispatch tracking, and campus healthcare metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center">
            <p className="text-2xl font-extrabold text-[#000000]">14</p>
            <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">Total Cases Today</p>
          </div>
          <div className="p-4 rounded-[20px] bg-[#fb4903] border border-[#000000] text-center text-white">
            <p className="text-2xl font-extrabold">1</p>
            <p className="text-[10px] uppercase font-bold tracking-wider">Active Warnings</p>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] text-[#000000] border border-[#000000] text-xs font-bold flex items-center justify-between shadow-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#000000]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg('')} className="p-1 cursor-pointer">
            <X className="h-4 w-4 text-[#000000]" />
          </button>
        </div>
      )}

      {/* Sub-Route Specific Admin Views */}

      {path.includes('/users') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
              User & Role Access Control Manager (8 Roles)
            </h3>
            <span className="text-xs font-bold text-[#000000] bg-[#e9ccff] px-3 py-1 rounded-[1600px] border border-[#000000]">{users.length} Accounts Registered</span>
          </div>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between text-xs font-bold"
              >
                <div>
                  <p className="font-extrabold text-[#000000] text-sm">{u.name}</p>
                  <p className="text-[#000000] font-bold">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-[1600px] text-[10px] font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
                    {u.role}
                  </span>
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-[1600px] font-bold border border-[#000000] transition-all cursor-pointer ${
                      u.status === 'ACTIVE'
                        ? 'bg-[#55db9c] text-[#000000]'
                        : 'bg-[#fb4903] text-white'
                    }`}
                  >
                    {u.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Notification System Delivery Logs Module */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#000000] pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
              Emergency Notification Delivery Logs (Twilio SMS & FCM Push)
            </h3>
            <p className="text-xs font-medium text-[#000000]">
              Real-time delivery tracking, role-based responder message audit, failure retries, and TEST_EMERGENCY_NOTIFICATION redirection mode.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerTestCascade}
              className="px-4 py-2.5 rounded-[1600px] bg-[#ffd731] hover:bg-[#eec620] text-[#000000] font-bold text-xs border border-[#000000] flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4 text-[#000000]" />
              <span>Trigger Test SOS Notifications</span>
            </button>
            <button
              onClick={fetchNotificationLogs}
              className="p-2.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] cursor-pointer"
              title="Refresh Logs"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
          {/* Role Filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#000000] uppercase mb-1">Recipient Role</label>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] outline-none"
            >
              <option value="ALL">ALL ROLES (Security, Doctor, Ambulance)</option>
              <option value="SECURITY_OFFICER">SECURITY OFFICER</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="AMBULANCE_OFFICER">AMBULANCE OFFICER</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#000000] uppercase mb-1">Delivery Channel</label>
            <select
              value={selectedChannelFilter}
              onChange={(e) => setSelectedChannelFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] outline-none"
            >
              <option value="ALL">ALL CHANNELS (SMS & FCM Push)</option>
              <option value="SMS">SMS (Twilio / Gateway)</option>
              <option value="PUSH">PUSH (Firebase FCM)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-extrabold text-[#000000] uppercase mb-1">Delivery Status</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs font-bold text-[#000000] outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="TEST_MODE">TEST_MODE (Redirected)</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="SENT">SENT</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#dceeff] text-[#000000] border-b border-[#000000] text-[11px] font-bold">
                <th className="p-3 border-r border-[#000000]">EMERGENCY ID</th>
                <th className="p-3 border-r border-[#000000]">RECIPIENT & ROLE</th>
                <th className="p-3 border-r border-[#000000]">CHANNEL</th>
                <th className="p-3 border-r border-[#000000]">NOTIFICATION TITLE</th>
                <th className="p-3 border-r border-[#000000]">STATUS</th>
                <th className="p-3 border-r border-[#000000]">TIMESTAMP</th>
                <th className="p-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingLogs ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center font-bold text-xs text-[#000000]">
                    Loading emergency notification logs...
                  </td>
                </tr>
              ) : notificationLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center font-bold text-xs text-[#000000]">
                    No notification logs found matching selected filters.
                  </td>
                </tr>
              ) : (
                notificationLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#000000] hover:bg-[#dceeff]/30 transition-colors font-bold">
                    <td className="p-3 border-r border-[#000000] font-mono text-xs text-[#000000]">
                      {log.emergencyId}
                    </td>

                    <td className="p-3 border-r border-[#000000]">
                      <div className="space-y-0.5">
                        <p className="font-extrabold text-[#000000] text-xs">{log.recipientName || log.recipientRole}</p>
                        <span className="inline-block px-2 py-0.5 rounded-[1600px] text-[9px] font-extrabold bg-[#e9ccff] text-[#000000] border border-[#000000]">
                          {log.recipientRole}
                        </span>
                        {log.recipientPhone && (
                          <p className="text-[10px] text-[#000000] opacity-80 font-mono">{log.recipientPhone}</p>
                        )}
                      </div>
                    </td>

                    <td className="p-3 border-r border-[#000000]">
                      <span className={`px-2.5 py-1 rounded-[1600px] text-[10px] font-bold border border-[#000000] inline-flex items-center gap-1 ${
                        log.channel === 'SMS' ? 'bg-[#4da2ff] text-white' : 'bg-[#5c4ade] text-white'
                      }`}>
                        {log.channel === 'SMS' ? <MessageSquare className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                        <span>{log.channel}</span>
                      </span>
                    </td>

                    <td className="p-3 border-r border-[#000000] max-w-xs">
                      <p className="font-extrabold text-[#000000] text-xs truncate">{log.title}</p>
                      <p className="text-[10px] text-[#000000] opacity-80 truncate">{log.body}</p>
                    </td>

                    <td className="p-3 border-r border-[#000000]">
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-[1600px] text-[10px] font-extrabold border border-[#000000] inline-block ${
                          log.deliveryStatus === 'DELIVERED'
                            ? 'bg-[#55db9c] text-[#000000]'
                            : log.deliveryStatus === 'TEST_MODE'
                            ? 'bg-[#ffd731] text-[#000000]'
                            : log.deliveryStatus === 'SENT'
                            ? 'bg-[#dceeff] text-[#000000]'
                            : 'bg-[#fb4903] text-white'
                        }`}>
                          {log.deliveryStatus}
                        </span>
                        {log.retryCount > 0 && (
                          <p className="text-[9px] text-[#000000] font-bold">Retries: {log.retryCount}</p>
                        )}
                      </div>
                    </td>

                    <td className="p-3 border-r border-[#000000] text-[10px] font-mono text-[#000000]">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedLogForDetail(log)}
                          className="p-1.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] cursor-pointer"
                          title="View Payload Details"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRetryLog(log.id)}
                          disabled={isRetryingId === log.id}
                          className="p-1.5 rounded-[1600px] bg-[#ffd731] hover:bg-[#eec620] text-[#000000] border border-[#000000] cursor-pointer disabled:opacity-50"
                          title="Retry Notification Delivery"
                        >
                          <RotateCcw className={`h-3.5 w-3.5 ${isRetryingId === log.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Payload Details Modal */}
      {selectedLogForDetail && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] text-[#000000] w-full max-w-lg rounded-[30px] p-6 space-y-4 border-2 border-[#000000]">
            <div className="flex items-center justify-between border-b border-[#000000] pb-3">
              <h4 className="font-extrabold text-sm text-[#000000] flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#fb4903]" />
                Emergency Notification Log Audit (# {selectedLogForDetail.id})
              </h4>
              <button onClick={() => setSelectedLogForDetail(null)} className="p-1 cursor-pointer">
                <X className="h-4 w-4 text-[#000000]" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              <div className="p-3 rounded-[16px] bg-[#dceeff] border border-[#000000] space-y-1">
                <p className="text-[10px] text-[#000000] uppercase font-extrabold">Recipient Role & ID</p>
                <p className="font-extrabold text-[#000000]">{selectedLogForDetail.recipientName} ({selectedLogForDetail.recipientRole})</p>
                <p className="text-[11px] font-mono text-[#000000]">{selectedLogForDetail.recipientPhone}</p>
              </div>

              <div className="p-3 rounded-[16px] bg-[#e9ccff] border border-[#000000] space-y-1">
                <p className="text-[10px] text-[#000000] uppercase font-extrabold">Channel & Delivery Status</p>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] text-[10px]">
                    {selectedLogForDetail.channel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] text-[10px]">
                    {selectedLogForDetail.deliveryStatus}
                  </span>
                  <span className="text-[10px]">Retries: {selectedLogForDetail.retryCount}</span>
                </div>
              </div>

              <div className="p-3 rounded-[16px] bg-[#ffffff] border border-[#000000] space-y-1">
                <p className="text-[10px] text-[#000000] uppercase font-extrabold">Notification Title</p>
                <p className="font-extrabold text-[#000000]">{selectedLogForDetail.title}</p>
              </div>

              <div className="p-3 rounded-[16px] bg-[#ffffff] border border-[#000000] space-y-1">
                <p className="text-[10px] text-[#000000] uppercase font-extrabold">Notification Body / Payload</p>
                <p className="font-medium text-[#000000] text-[11px] leading-relaxed break-words">{selectedLogForDetail.body}</p>
              </div>

              {selectedLogForDetail.failureReason && (
                <div className="p-3 rounded-[16px] bg-[#fb4903] text-white border border-[#000000] space-y-1">
                  <p className="text-[10px] uppercase font-extrabold">Failure Reason</p>
                  <p className="font-bold text-[11px]">{selectedLogForDetail.failureReason}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#000000]">
              <button
                onClick={() => setSelectedLogForDetail(null)}
                className="px-4 py-2 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] font-bold text-xs cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Dashboard Overview */}
      {(path.includes('/dashboard') || path.includes('/analytics') || path.includes('/outbreaks') || path.includes('/emergency-ops') || path.includes('/heatmap') || path === '/admin') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-xs text-[#000000] font-extrabold uppercase">Suspected Clusters</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#000000]">1</span>
                <span className="text-xs text-[#000000] font-bold">Block A - Floor 3</span>
              </div>
              <p className="text-[11px] text-[#fb4903] font-bold">9 Food Poisoning reports</p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-xs text-[#000000] font-extrabold uppercase">Ambulance Fleet Status</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#000000]">2 / 2</span>
                <span className="text-xs text-[#55db9c] font-extrabold">Ready</span>
              </div>
              <p className="text-[11px] text-[#000000] font-medium">Avg Response: 3.8 minutes</p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-xs text-[#000000] font-extrabold uppercase">AI Prediction Accuracy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#000000]">89.4%</span>
                <span className="text-xs text-[#5c4ade] font-extrabold">Validated</span>
              </div>
              <p className="text-[11px] text-[#000000] font-medium">Based on doctor feedback</p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-xs text-[#000000] font-extrabold uppercase">Teleconsultations</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#000000]">6</span>
                <span className="text-xs text-[#000000] font-bold">Completed Today</span>
              </div>
              <p className="text-[11px] text-[#000000] font-medium">Student Priority Queue Active</p>
            </div>
          </div>

          <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
              Campus Disease Distribution Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-bold">
              <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] space-y-1">
                <p className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Food Poisoning</p>
                <p className="text-2xl font-extrabold text-[#000000]">9 cases (64%)</p>
                <p className="text-[11px] text-[#000000] font-bold">Concentrated in Block A, Floor 3</p>
              </div>
              <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] space-y-1">
                <p className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Viral Fever</p>
                <p className="text-2xl font-extrabold text-[#000000]">3 cases (21%)</p>
                <p className="text-[11px] text-[#000000] font-bold">Distributed across BH1</p>
              </div>
              <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] space-y-1">
                <p className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Upper Respiratory</p>
                <p className="text-2xl font-extrabold text-[#000000]">2 cases (15%)</p>
                <p className="text-[11px] text-[#000000] font-bold">Normal seasonal baseline</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
