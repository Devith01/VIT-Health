import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { User, RoleName } from '../types/auth';
import { loginApi, getMeApi, logoutApi, signupApi, SignupPayload } from '../api/auth.api';
import { apiClient } from '../api/axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLocationSaved: boolean;
  login: (emailOrRegNo: string, password: string) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<any>;
  loginDemoUser: (role: RoleName) => Promise<User>;
  updateHostelLocation: (blockName: string, roomNum: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ROLE_EMAILS: Record<RoleName, string> = {
  STUDENT: 'shri.25BHI10021@vitbhopal.ac.in',
  DOCTOR: 'doctor@demo.com',
  ADMIN: 'admin@demo.com',
  SECURITY_OFFICER: 'security@demo.com',
  AMBULANCE_OFFICER: 'ambulance@demo.com',
  FLOOR_REPRESENTATIVE: 'floorrep@demo.com',
  PHARMACY_STAFF: 'pharmacy@demo.com',
  PHARMACY_DESK: 'pharmacy@demo.com',
  FACULTY: 'faculty@demo.com',
};

export const BLOOD_GROUPS = [
  'O+ Positive',
  'A+ Positive',
  'B+ Positive',
  'AB+ Positive',
  'O- Negative',
  'A- Negative',
  'B- Negative',
  'AB- Negative',
];

export const ALLERGIES_LIST = [
  'Penicillin (Mild), Dust Mites',
  'Lactose Intolerance, Pollen',
  'Sulfa Drugs, Peanuts (Mild)',
  'None (No Known Allergies)',
  'Latex, Shellfish (Mild)',
  'Aspirin / NSAIDs (Mild)',
  'Dust Mites, Mold Spores',
  'None (No Known Medical Allergies)',
];

export function getStudentMedicalAttributes(email: string) {
  let hash = 0;

  const str = email || 'student@vitbhopal.ac.in';

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000007;
  }

  const bloodGroup =
    BLOOD_GROUPS[hash % BLOOD_GROUPS.length];

  const knownAllergies =
    ALLERGIES_LIST[(hash * 7) % ALLERGIES_LIST.length];

  const regMatch = str.match(/\d{2}[A-Za-z]{3}\d{4,5}/);

  const registrationNo = regMatch
    ? regMatch[0].toUpperCase()
    : `25BHI${10000 + (hash % 89999)}`;

  return {
    bloodGroup,
    knownAllergies,
    registrationNo,
  };
}

export const MOCK_FRONTEND_USERS: Record<RoleName, User> = {
  STUDENT: {
    id: 'user-std-25bhi',
    name: 'Devith',
    fullName: 'Devith',
    email: 'devith.25BHI10021@vitbhopal.ac.in',
    role: 'STUDENT',
    roleName: 'STUDENT',
    registrationNumber: '25BHI10021',
    mobileNumber: '7904789214',
    hostelBlock: 'Boys Hostel 1',
    roomNumber: '501',
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
          },
        },
      },
    },
  },

  DOCTOR: {
    id: 'doctor-001',
    name: 'Dr. Arun Kumar',
    fullName: 'Dr. Arun Kumar (MCI License #2018-9941)',
    email: 'doctor@demo.com',
    role: 'DOCTOR',
    roleName: 'DOCTOR',
    doctorProfile: {
      id: 'dp-1',
      specialization: 'General Medicine & Campus Epidemic Surveillance',
      licenseNumber: 'MCI-2018-9941',
    },
  },

  ADMIN: {
    id: 'admin-001',
    name: 'System Administrator',
    fullName: 'Chief Campus Health Officer / System Admin',
    email: 'admin@demo.com',
    role: 'ADMIN',
    roleName: 'ADMIN',
  },

  SECURITY_OFFICER: {
    id: 'security-001',
    name: 'Security Officer',
    fullName: 'Officer Deshmukh (Main Gate Security Desk)',
    email: 'security@demo.com',
    role: 'SECURITY_OFFICER',
    roleName: 'SECURITY_OFFICER',
    securityOfficerProfile: {
      id: 'sec-1',
      badgeNumber: 'SEC-8841',
      assignedBlockName: 'Block A',
    },
  },

  AMBULANCE_OFFICER: {
    id: 'ambulance-001',
    name: 'Karthik Raj',
    fullName: 'Karthik Raj (Ambulance Alpha Driver)',
    email: 'ambulance@demo.com',
    role: 'AMBULANCE_OFFICER',
    roleName: 'AMBULANCE_OFFICER',
    ambulanceOfficerProfile: {
      id: 'amb-off-1',
      vehicleNumber: 'MP-04-VT-1001',
    },
  },

  FLOOR_REPRESENTATIVE: {
    id: 'floorrep-001',
    name: 'Rohan Sharma',
    fullName: 'Rohan Sharma (Block A Floor 3 Rep)',
    email: 'floorrep@vitbhopal.ac.in',
    role: 'FLOOR_REPRESENTATIVE',
    roleName: 'FLOOR_REPRESENTATIVE',
    floorRepresentativeProfile: {
      id: 'rep-1',
      assignedBlockName: 'Block A',
      assignedFloorNum: 3,
    },
  },

  PHARMACY_STAFF: {
    id: 'pharmacy-001',
    name: 'Pharmacy Manager',
    fullName: 'Campus Pharmacy Desk Staff',
    email: 'pharmacy@demo.com',
    role: 'PHARMACY_STAFF',
    roleName: 'PHARMACY_STAFF',
    pharmacyStaffProfile: {
      id: 'phr-1',
      staffCode: 'PHARM-202',
    },
  },

  PHARMACY_DESK: {
    id: 'pharmacy-001',
    name: 'Pharmacy Manager',
    fullName: 'Campus Pharmacy Desk Staff',
    email: 'pharmacy@demo.com',
    role: 'PHARMACY_DESK',
    roleName: 'PHARMACY_DESK',
    pharmacyStaffProfile: {
      id: 'phr-1',
      staffCode: 'PHARM-202',
    },
  },

  FACULTY: {
    id: 'faculty-001',
    name: 'Prof. Rajesh Kumar',
    fullName: 'Prof. Rajesh Kumar (CSE Dept)',
    email: 'faculty@demo.com',
    role: 'FACULTY',
    roleName: 'FACULTY',
    facultyProfile: {
      id: 'fac-1',
      employeeId: 'VIT-FAC-1004',
      department: 'Computer Science & Engineering',
    },
  },
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser =
      localStorage.getItem('vithealth_user') ||
      localStorage.getItem('vhealth_user');

    const demoRole =
      localStorage.getItem('demoUserRole') as RoleName;

    let initialUser: User | null = null;

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const rawName = (parsed.fullName || parsed.name || '').trim();
        const isStaleName = rawName.toLowerCase().includes('shri patel');
        const cleanName = isStaleName ? 'Devith' : (parsed.fullName || parsed.name || 'User');

        initialUser = {
          ...parsed,
          role: parsed.role || parsed.roleName || 'STUDENT',
          roleName:
            parsed.role || parsed.roleName || 'STUDENT',
          name: cleanName,
          fullName: cleanName,
        };
      } catch {
        initialUser = null;
      }
    } else if (
      demoRole &&
      MOCK_FRONTEND_USERS[demoRole]
    ) {
      initialUser = MOCK_FRONTEND_USERS[demoRole];
    } else {
      initialUser = null;
    }

    if (initialUser && initialUser.email) {
      const savedLoc = localStorage.getItem(
        `vithealth_hostel_loc_${initialUser.email}`
      );

      if (savedLoc) {
        try {
          const roomObj = JSON.parse(savedLoc);

          if (!initialUser.studentProfile) {
            const attrs =
              getStudentMedicalAttributes(initialUser.email);

            initialUser.studentProfile = {
              id: `sp-${initialUser.email}`,
              registrationNo: attrs.registrationNo,
              department:
                'Computer Science & Engineering',
              yearOfStudy: 1,
              room: roomObj,
            };
          } else {
            initialUser.studentProfile.room = roomObj;
          }
        } catch {}
      }
    }

    return initialUser;
  });

  const [token, setToken] = useState<string | null>(
    () =>
      localStorage.getItem('vithealth_token') ||
      localStorage.getItem('vhealth_token') ||
      null
  );

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (!user || !token) return;

    localStorage.setItem('vithealth_token', token);
    localStorage.setItem('vithealth_user', JSON.stringify(user));
    localStorage.setItem('demoUserRole', user.roleName);
  }, [token, user]);

  /*
   * ----------------------------------------------------------
   * Normal backend login
   * ----------------------------------------------------------
   */
  const login = async (
    emailOrRegNo: string,
    password: string
  ) => {
    setIsLoading(true);

    try {
      const response = await loginApi(
        emailOrRegNo,
        password
      );

      const studentProf = response.data.user.studentProfile;
      const regNo =
        response.data.user.registrationNumber ||
        studentProf?.registrationNo ||
        (emailOrRegNo.includes('@') ? '' : emailOrRegNo.toUpperCase());

      const hostel =
        response.data.user.hostelBlock ||
        studentProf?.room?.floor?.block?.hostel?.name ||
        studentProf?.room?.floor?.block?.name ||
        'Boys Hostel 1';

      const room =
        response.data.user.roomNumber ||
        studentProf?.room?.roomNum ||
        '301';

      const u: User = {
        ...response.data.user,
        role:
          response.data.user.role ||
          response.data.user.roleName ||
          'STUDENT',
        roleName:
          response.data.user.role ||
          response.data.user.roleName ||
          'STUDENT',
        name:
          response.data.user.name ||
          response.data.user.fullName ||
          `Student ${regNo}`,
        fullName:
          response.data.user.fullName ||
          response.data.user.name ||
          `Student ${regNo}`,
        registrationNumber: regNo,
        mobileNumber:
          response.data.user.mobileNumber || response.data.user.phoneNumber,
        phoneNumber:
          response.data.user.phoneNumber || response.data.user.mobileNumber,
        hostelBlock: hostel,
        roomNumber: room,
        studentProfile: studentProf || {
          id: `sp-${regNo}`,
          registrationNo: regNo,
          department: 'General',
          yearOfStudy: 1,
          room: {
            roomNum: room,
            floor: {
              floorNum: parseInt(room.replace(/\D/g, '')[0]) || 1,
              block: {
                name: hostel,
                hostel: {
                  name: hostel,
                },
              },
            },
          },
        },
      };

      setUser(u);
      setToken(response.data.token);

      localStorage.setItem(
        'vithealth_token',
        response.data.token
      );

      localStorage.setItem(
        'vithealth_user',
        JSON.stringify(u)
      );

      localStorage.setItem(
        'demoUserRole',
        u.role
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: SignupPayload) => {
    setIsLoading(true);
    try {
      const response = await signupApi(payload);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ----------------------------------------------------------
   * Demo login
   * ----------------------------------------------------------
   */
  const loginDemoUser = async (
    role: RoleName
  ): Promise<User> => {
    let mockUser =
      MOCK_FRONTEND_USERS[role] ||
      MOCK_FRONTEND_USERS.STUDENT;

    if (mockUser.email) {
      const savedLoc = localStorage.getItem(
        `vithealth_hostel_loc_${mockUser.email}`
      );

      if (savedLoc) {
        try {
          const roomObj = JSON.parse(savedLoc);

          mockUser = {
            ...mockUser,
            studentProfile: {
              ...mockUser.studentProfile,
              id:
                mockUser.studentProfile?.id ||
                'sp-25bhi10021',
              registrationNo:
                mockUser.studentProfile
                  ?.registrationNo ||
                '25BHI10021',
              department:
                mockUser.studentProfile
                  ?.department ||
                'Computer Science & Engineering',
              yearOfStudy:
                mockUser.studentProfile
                  ?.yearOfStudy || 1,
              room: roomObj,
            },
          };
        } catch {}
      }
    }

    const fakeToken =
      `mock-jwt-token-demo-${role.toLowerCase()}`;

    setUser(mockUser);
    setToken(fakeToken);

    localStorage.setItem(
      'demoUserRole',
      role
    );

    localStorage.setItem(
      'vithealth_token',
      fakeToken
    );

    localStorage.setItem(
      'vithealth_user',
      JSON.stringify(mockUser)
    );

    return mockUser;
  };

  /*
   * ----------------------------------------------------------
   * Hostel location
   * ----------------------------------------------------------
   */
  const updateHostelLocation = (
    blockName: string,
    roomNum: string
  ) => {
    if (!user || !user.email) return;

    const floorNum =
      parseInt(
        (roomNum || '301')
          .replace(/\D/g, '')[0]
      ) || 3;

    const newRoom = {
      roomNum: roomNum || '301',
      floor: {
        floorNum,
        block: {
          name: blockName,
        },
      },
    };

    const updatedUser: User = {
      ...user,

      studentProfile: {
        ...user.studentProfile,

        id:
          user.studentProfile?.id ||
          'sp-25bhi10021',

        registrationNo:
          user.studentProfile?.registrationNo ||
          '25BHI10021',

        department:
          user.studentProfile?.department ||
          'Computer Science & Engineering',

        yearOfStudy:
          user.studentProfile?.yearOfStudy || 1,

        room: newRoom,
      },
    };

    setUser(updatedUser);

    localStorage.setItem(
      `vithealth_hostel_loc_${user.email}`,
      JSON.stringify(newRoom)
    );

    localStorage.setItem(
      `vithealth_location_saved_${user.email}`,
      'true'
    );

    localStorage.setItem(
      'vithealth_user',
      JSON.stringify(updatedUser)
    );

    apiClient
      .patch('/users/location', {
        blockName,
        roomNum,
      })
      .catch(() => {});
  };

  /*
   * ----------------------------------------------------------
   * Logout
   * ----------------------------------------------------------
   */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      'vithealth_token'
    );

    localStorage.removeItem(
      'vhealth_token'
    );

    localStorage.removeItem(
      'vithealth_user'
    );

    localStorage.removeItem(
      'vhealth_user'
    );

    localStorage.removeItem(
      'demoUserRole'
    );

    logoutApi().catch(() => {});
  };

  const isLocationSaved = !!(
    user?.email &&
    (
      localStorage.getItem(
        `vithealth_location_saved_${user.email}`
      ) === 'true' ||
      !!user.studentProfile?.room?.roomNum
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated:
          !!user && !!token,
        isLoading,
        isLocationSaved,
        login,
        signup,
        loginDemoUser,
        updateHostelLocation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};
