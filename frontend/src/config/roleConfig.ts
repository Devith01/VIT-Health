import { RoleName } from '../types/auth';

export interface NavItemConfig {
  label: string;
  path: string;
  iconName: string;
}

export interface RoleConfigItem {
  dashboard: string;
  allowedRoutes: string[];
  navigation: NavItemConfig[];
}

export const ROLE_CONFIG: Record<RoleName, RoleConfigItem> = {
  STUDENT: {
    dashboard: '/student/dashboard',
    allowedRoutes: [
      '/student/dashboard',
      '/student/records',
      '/symptoms',
      '/appointments',
      '/emergency',
      '/mental-health',
    ],
    navigation: [
      { label: 'My Dashboard', path: '/student/dashboard', iconName: 'LayoutDashboard' },
      { label: 'AI Symptom Checker', path: '/symptoms', iconName: 'Stethoscope' },
      { label: 'Appointments', path: '/appointments', iconName: 'Calendar' },
      { label: 'Emergency & Ambulance', path: '/emergency', iconName: 'Truck' },
      { label: 'Mental Health', path: '/mental-health', iconName: 'Brain' },
      { label: 'My Health Records', path: '/student/records', iconName: 'FileText' },
    ],
  },
  FACULTY: {
    dashboard: '/faculty/dashboard',
    allowedRoutes: [
      '/faculty/dashboard',
      '/faculty/records',
      '/symptoms',
      '/appointments',
      '/emergency',
      '/mental-health',
    ],
    navigation: [
      { label: 'My Dashboard', path: '/faculty/dashboard', iconName: 'LayoutDashboard' },
      { label: 'AI Symptom Checker', path: '/symptoms', iconName: 'Stethoscope' },
      { label: 'Appointments', path: '/appointments', iconName: 'Calendar' },
      { label: 'Emergency & Ambulance', path: '/emergency', iconName: 'Truck' },
      { label: 'Mental Health', path: '/mental-health', iconName: 'Brain' },
      { label: 'My Health Records', path: '/faculty/records', iconName: 'FileText' },
    ],
  },
  DOCTOR: {
    dashboard: '/doctor/dashboard',
    allowedRoutes: [
      '/doctor/dashboard',
      '/doctor/queue',
      '/doctor/ai-insights',
      '/doctor/prescriptions',
      '/doctor/follow-ups',
      '/doctor/medical-leave',
      '/appointments',
      '/symptoms',
      '/surveillance',
    ],
    navigation: [
      { label: 'Doctor Dashboard', path: '/doctor/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Patient Queue', path: '/doctor/queue', iconName: 'UserCheck' },
      { label: 'Appointments', path: '/appointments', iconName: 'Calendar' },
      { label: 'AI Clinical Insights', path: '/doctor/ai-insights', iconName: 'Brain' },
      { label: 'Prescriptions', path: '/doctor/prescriptions', iconName: 'FileText' },
      { label: 'Follow-ups', path: '/doctor/follow-ups', iconName: 'Clock' },
      { label: 'Medical Leave', path: '/doctor/medical-leave', iconName: 'Award' },
    ],
  },
  ADMIN: {
    dashboard: '/admin/dashboard',
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/heatmap',
      '/admin/outbreaks',
      '/admin/emergency-ops',
      '/admin/ambulances',
      '/admin/users',
      '/admin/analytics',
      '/admin/ai-performance',
      '/surveillance',
      '/emergency',
    ],
    navigation: [
      { label: 'Admin Dashboard', path: '/admin/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Disease Surveillance', path: '/surveillance', iconName: 'ShieldAlert' },
      { label: 'Campus Heatmap', path: '/admin/heatmap', iconName: 'Layers' },
      { label: 'Outbreak Alerts', path: '/admin/outbreaks', iconName: 'TrendingUp' },
      { label: 'Emergency Operations', path: '/admin/emergency-ops', iconName: 'Activity' },
      { label: 'Ambulance Management', path: '/admin/ambulances', iconName: 'Truck' },
      { label: 'User & Role Management', path: '/admin/users', iconName: 'Users' },
      { label: 'System Analytics', path: '/admin/analytics', iconName: 'BarChart' },
      { label: 'AI Performance', path: '/admin/ai-performance', iconName: 'Cpu' },
    ],
  },
  SECURITY_OFFICER: {
    dashboard: '/security/dashboard',
    allowedRoutes: [
      '/security/dashboard',
      '/security/emergencies',
      '/security/history',
      '/security/location',
      '/security/ambulance-coordination',
      '/security/incidents',
      '/emergency',
    ],
    navigation: [
      { label: 'Security Dashboard', path: '/security/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Active Emergencies', path: '/security/emergencies', iconName: 'ShieldAlert' },
      { label: 'Emergency History', path: '/security/history', iconName: 'Clock' },
      { label: 'Live Location', path: '/security/location', iconName: 'MapPin' },
      { label: 'Ambulance Coordination', path: '/security/ambulance-coordination', iconName: 'Truck' },
      { label: 'Incident Reports', path: '/security/incidents', iconName: 'FileText' },
    ],
  },
  AMBULANCE_OFFICER: {
    dashboard: '/ambulance/dashboard',
    allowedRoutes: [
      '/ambulance/dashboard',
      '/ambulance/current-assignment',
      '/ambulance/live-map',
      '/ambulance/emergencies',
      '/ambulance/status',
      '/ambulance/history',
      '/emergency',
    ],
    navigation: [
      { label: 'Ambulance Dashboard', path: '/ambulance/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Current Assignment', path: '/ambulance/current-assignment', iconName: 'Truck' },
      { label: 'Live Map & Navigation', path: '/ambulance/live-map', iconName: 'MapPin' },
      { label: 'Active Emergencies', path: '/ambulance/emergencies', iconName: 'ShieldAlert' },
      { label: 'Ambulance Status', path: '/ambulance/status', iconName: 'Activity' },
      { label: 'Emergency History', path: '/ambulance/history', iconName: 'Clock' },
    ],
  },
  FLOOR_REPRESENTATIVE: {
    dashboard: '/floor-representative/dashboard',
    allowedRoutes: [
      '/floor-representative/dashboard',
      '/floor-representative/alerts',
      '/floor-representative/trends',
      '/floor-representative/emergency-alerts',
      '/floor-representative/report-issue',
      '/floor-representative/notifications',
      '/surveillance',
    ],
    navigation: [
      { label: 'Floor Dashboard', path: '/floor-representative/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Health Alerts', path: '/floor-representative/alerts', iconName: 'ShieldAlert' },
      { label: 'Floor Health Trends', path: '/floor-representative/trends', iconName: 'TrendingUp' },
      { label: 'Emergency Alerts', path: '/floor-representative/emergency-alerts', iconName: 'Bell' },
      { label: 'Report Environmental Issue', path: '/floor-representative/report-issue', iconName: 'AlertTriangle' },
      { label: 'Notifications', path: '/floor-representative/notifications', iconName: 'MessageSquare' },
    ],
  },
  PHARMACY_STAFF: {
    dashboard: '/pharmacy/dashboard',
    allowedRoutes: [
      '/pharmacy/dashboard',
      '/pharmacy/orders',
      '/pharmacy/prescriptions',
      '/pharmacy/inventory',
      '/pharmacy/delivery',
      '/pharmacy/history',
      '/pharmacy',
    ],
    navigation: [
      { label: 'Pharmacy Dashboard', path: '/pharmacy/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Medicine Orders', path: '/pharmacy/orders', iconName: 'PackageCheck' },
      { label: 'Prescription Queue', path: '/pharmacy/prescriptions', iconName: 'FileText' },
      { label: 'Inventory', path: '/pharmacy/inventory', iconName: 'Pill' },
      { label: 'Delivery Management', path: '/pharmacy/delivery', iconName: 'Truck' },
      { label: 'Order History', path: '/pharmacy/history', iconName: 'Clock' },
    ],
  },
  PHARMACY_DESK: {
    dashboard: '/pharmacy/dashboard',
    allowedRoutes: [
      '/pharmacy/dashboard',
      '/pharmacy/orders',
      '/pharmacy/prescriptions',
      '/pharmacy/inventory',
      '/pharmacy/delivery',
      '/pharmacy/history',
      '/pharmacy',
    ],
    navigation: [
      { label: 'Pharmacy Dashboard', path: '/pharmacy/dashboard', iconName: 'LayoutDashboard' },
      { label: 'Medicine Orders', path: '/pharmacy/orders', iconName: 'PackageCheck' },
      { label: 'Prescription Queue', path: '/pharmacy/prescriptions', iconName: 'FileText' },
      { label: 'Inventory', path: '/pharmacy/inventory', iconName: 'Pill' },
      { label: 'Delivery Management', path: '/pharmacy/delivery', iconName: 'Truck' },
      { label: 'Order History', path: '/pharmacy/history', iconName: 'Clock' },
    ],
  },
};
