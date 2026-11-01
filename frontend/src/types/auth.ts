export type RoleName =
  | 'STUDENT'
  | 'DOCTOR'
  | 'ADMIN'
  | 'SECURITY_OFFICER'
  | 'AMBULANCE_OFFICER'
  | 'FLOOR_REPRESENTATIVE'
  | 'PHARMACY_STAFF'
  | 'PHARMACY_DESK'
  | 'FACULTY';

export interface User {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: RoleName;
  roleName: RoleName;
  phoneNumber?: string;
  registrationNumber?: string;
  mobileNumber?: string;
  hostelBlock?: string;
  roomNumber?: string;
  studentProfile?: {
    id: string;
    registrationNo: string;
    department: string;
    yearOfStudy: number;
    bloodGroup?: string;
    knownAllergies?: string;
    room?: {
      roomNum: string;
      floor?: {
        floorNum: number;
        block?: {
          name: string;
          hostel?: {
            name: string;
          };
        };
      };
    };
  };
  doctorProfile?: {
    id: string;
    specialization: string;
    licenseNumber: string;
  };
  securityOfficerProfile?: {
    id: string;
    badgeNumber: string;
    assignedBlockName?: string;
  };
  ambulanceOfficerProfile?: {
    id: string;
    vehicleNumber: string;
  };
  floorRepresentativeProfile?: {
    id: string;
    assignedBlockName: string;
    assignedFloorNum: number;
  };
  pharmacyStaffProfile?: {
    id: string;
    staffCode: string;
  };
  facultyProfile?: {
    id: string;
    employeeId: string;
    department: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}
