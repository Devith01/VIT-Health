import React from 'react';
import { useAuth } from '../context/AuthContext';

export const GenericRoleDashboard: React.FC = () => {
  const { user } = useAuth();

  const getRoleDetails = () => {
    switch (user?.roleName) {
      case 'SECURITY_OFFICER':
        return {
          title: 'Campus Security Dashboard',
          description: 'Emergency response, room assistance, and perimeter alert logs.',
        };
      case 'AMBULANCE_OFFICER':
        return {
          title: 'Smart Ambulance Console',
          description: 'Emergency dispatch tracking, route guidance, and status pipeline.',
        };
      case 'PHARMACY_DESK':
        return {
          title: 'Pharmacy Desk Dashboard',
          description: 'Prescription orders, hostel delivery tracking, and medication inventory.',
        };
      case 'FLOOR_REPRESENTATIVE':
        return {
          title: 'Floor Representative Dashboard',
          description: 'Floor health advisories, case count trends, and sanitation notices.',
        };
      default:
        return {
          title: `${user?.roleName || 'User'} Dashboard`,
          description: 'Role-specific healthcare portal for VIT Bhopal.',
        };
    }
  };

  const details = getRoleDetails();

  return (
    <div className="space-y-6 text-carbon">
      <div className="p-6 rounded-[30px] bg-paper-white border border-carbon space-y-2 shadow-none">
        <h2 className="text-2xl font-bold tracking-tight">{details.title}</h2>
        <p className="text-xs text-carbon/70 font-medium">{details.description}</p>
      </div>
    </div>
  );
};
