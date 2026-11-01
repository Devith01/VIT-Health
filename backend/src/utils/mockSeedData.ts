// In-memory fallback mock dataset for local development or prototype demonstration without live DB connection

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  roleName: string;
  role?: string;
  phoneNumber?: string;
  registrationNo?: string;
  registrationNumber?: string;
  mobileNumber?: string;
  hostelBlock?: string;
  roomNumber?: string;
  passwordHash?: string;
  blockName?: string;
  floorNum?: number;
  roomNum?: string;
  specialization?: string;
  vehicleNumber?: string;
  badgeNumber?: string;
  staffCode?: string;
  employeeId?: string;
  studentProfile?: any;
}

export const REGISTERED_STUDENTS: any[] = [];

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-std-25bhi10021',
    email: 'devith.25BHI10021@vitbhopal.ac.in',
    fullName: 'Devith',
    name: 'Devith',
    roleName: 'STUDENT',
    role: 'STUDENT',
    phoneNumber: '+91 7904789214',
    mobileNumber: '7904789214',
    registrationNo: '25BHI10021',
    registrationNumber: '25BHI10021',
    hostelBlock: 'Boys Hostel 1',
    roomNumber: '501',
    blockName: 'Boys Hostel 1',
    floorNum: 5,
    roomNum: '501',
    passwordHash: '$2a$10$9UrsZEFoC2kufPuoVQTfb.7t38M5TUApF4t3nDIMKVG85owZuZ61W', // bcrypt hash of Password@123
    studentProfile: {
      id: 'sp-25bhi10021',
      registrationNo: '25BHI10021',
      department: 'Computer Science & Engineering',
      yearOfStudy: 1,
      room: {
        roomNum: '501',
        floor: {
          floorNum: 5,
          block: {
            name: 'Boys Hostel 1',
            hostel: {
              name: 'Boys Hostel 1',
            },
          },
        },
      },
    },
  },
  {
    id: 'user-std-1',
    email: 'student@demo.com',
    fullName: 'Aarav Patel',
    roleName: 'STUDENT',
    phoneNumber: '+91 9876543210',
    registrationNo: '21BCE1001',
    blockName: 'Block A',
    floorNum: 3,
    roomNum: '301',
  },
  {
    id: 'user-doc-1',
    email: 'doctor@demo.com',
    fullName: 'Dr. Vikramaditya Sen',
    roleName: 'DOCTOR',
    phoneNumber: '+91 9898989898',
    specialization: 'General Medicine & Campus Epidemic Surveillance',
  },
  {
    id: 'user-adm-1',
    email: 'admin@demo.com',
    fullName: 'Chief Medical Officer / Admin',
    roleName: 'ADMIN',
  },
  {
    id: 'user-sec-1',
    email: 'security@demo.com',
    fullName: 'Officer Deshmukh (Main Security Desk)',
    roleName: 'SECURITY_OFFICER',
    badgeNumber: 'SEC-8841',
  },
  {
    id: 'user-amb-1',
    email: 'ambulance@demo.com',
    fullName: 'Ramesh Kumar (Ambulance Alpha Driver)',
    roleName: 'AMBULANCE_OFFICER',
    vehicleNumber: 'MP-04-VT-1001',
  },
  {
    id: 'user-rep-1',
    email: 'floorrep@demo.com',
    fullName: 'Rohan Sharma (Floor Representative)',
    roleName: 'FLOOR_REPRESENTATIVE',
    blockName: 'Block A',
    floorNum: 3,
  },
  {
    id: 'user-phr-1',
    email: 'pharmacy@demo.com',
    fullName: 'Campus Pharmacy Manager',
    roleName: 'PHARMACY_DESK',
    staffCode: 'PHARM-202',
  },
  {
    id: 'user-fac-1',
    email: 'faculty@demo.com',
    fullName: 'Prof. Rajesh Kumar (CSE Dept)',
    roleName: 'FACULTY',
    employeeId: 'VIT-FAC-1004',
  },
];

export const MOCK_OUTBREAK_ALERTS = [
  {
    id: 'alert-1',
    diseaseCategory: 'Food Poisoning',
    scope: 'FLOOR',
    targetLocationName: 'Block A - Floor 3',
    status: 'WARNING',
    currentCount: 9,
    thresholdCount: 10,
    predictedNextCount: 12,
    outbreakRisk: 'HIGH',
    message: 'EARLY WARNING: 9 suspected cases of Food Poisoning reported in Block A - Floor 3 within 24 hours. Threshold is 10. LSTM model predicts 12 cases tomorrow.',
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_AMBULANCES = [
  {
    id: 'amb-1',
    vehicleNumber: 'MP-04-VT-1001',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91 9988776655',
    status: 'AVAILABLE',
    currentLat: 23.0775,
    currentLng: 76.8513,
  },
  {
    id: 'amb-2',
    vehicleNumber: 'MP-04-VT-1002',
    driverName: 'Suresh Singh',
    driverPhone: '+91 9988776656',
    status: 'AVAILABLE',
    currentLat: 23.0780,
    currentLng: 76.8520,
  },
];
