import { PrismaClient, RoleName, SeverityLevel, DiseaseScope, AlertStatus, OutbreakRisk, AmbulanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting VIT-Health Database Seeding...');

  // 1. Password hash for demo users
  const defaultPasswordHash = await bcrypt.hash('Demo@12345', 10);

  // 2. Clear Existing Data (in reverse dependency order)
  console.log('🧹 Cleaning old records...');
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.mentalHealthScreening.deleteMany();
  await prisma.ambulanceLocation.deleteMany();
  await prisma.emergencyCase.deleteMany();
  await prisma.ambulance.deleteMany();
  await prisma.outbreakAlert.deleteMany();
  await prisma.diseaseThreshold.deleteMany();
  await prisma.diseaseCase.deleteMany();
  await prisma.medicineOrderItem.deleteMany();
  await prisma.medicineOrder.deleteMany();
  await prisma.prescriptionMedication.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.aiFeedback.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.aiPrediction.deleteMany();
  await prisma.symptomReport.deleteMany();
  await prisma.symptomQuestion.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.block.deleteMany();
  await prisma.hostel.deleteMany();

  // 3. Seed Campus Infrastructure
  console.log('🏫 Seeding Hostels, Blocks, Floors, and Rooms...');
  const boysHostel = await prisma.hostel.create({
    data: {
      name: 'Boys Hostel 1',
      code: 'BH1',
      blocks: {
        create: [
          {
            name: 'Block A',
            floors: {
              create: [1, 2, 3, 4, 5].map((floorNum) => ({
                floorNum,
                rooms: {
                  create: [1, 2, 3, 4, 5].map((roomNum) => ({
                    roomNum: `${floorNum}0${roomNum}`,
                  })),
                },
              })),
            },
          },
          {
            name: 'Block B',
            floors: {
              create: [1, 2, 3].map((floorNum) => ({
                floorNum,
                rooms: {
                  create: [1, 2, 3].map((roomNum) => ({
                    roomNum: `${floorNum}0${roomNum}`,
                  })),
                },
              })),
            },
          },
        ],
      },
    },
  });

  // Get Room 301, 302, 303 in Block A Floor 3 for seeding
  const blockA = await prisma.block.findFirst({ where: { name: 'Block A' } });
  const floor3 = await prisma.floor.findFirst({
    where: { blockId: blockA!.id, floorNum: 3 },
    include: { rooms: true },
  });
  const room301 = floor3!.rooms.find((r) => r.roomNum === '301');
  const room302 = floor3!.rooms.find((r) => r.roomNum === '302');
  const room303 = floor3!.rooms.find((r) => r.roomNum === '303');
  const room304 = floor3!.rooms.find((r) => r.roomNum === '304');

  // 4. Seed Core Users & Profiles across 12 Roles
  console.log('👥 Seeding Seeded Users & Profiles...');

  // Student 1 (Primary Demo Student)
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Aarav Patel',
      phoneNumber: '+91 9876543210',
      roleName: RoleName.STUDENT,
      studentProfile: {
        create: {
          registrationNo: '21BCE1001',
          roomId: room301?.id,
          emergencyContact: '+91 9876543211 (Father)',
          isHosteller: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Student 2 (Same Floor - Block A, Floor 3, Room 302)
  const studentUser2 = await prisma.user.create({
    data: {
      email: 'student2@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Rohan Sharma',
      phoneNumber: '+91 9876543212',
      roleName: RoleName.STUDENT,
      studentProfile: {
        create: {
          registrationNo: '21BCE1002',
          roomId: room302?.id,
          emergencyContact: '+91 9876543213',
          isHosteller: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Student 3 (Room 303)
  const studentUser3 = await prisma.user.create({
    data: {
      email: 'student3@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Priya Verma',
      phoneNumber: '+91 9876543214',
      roleName: RoleName.STUDENT,
      studentProfile: {
        create: {
          registrationNo: '21BCE1003',
          roomId: room303?.id,
          emergencyContact: '+91 9876543215',
          isHosteller: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Doctor User
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Vikramaditya Sen',
      phoneNumber: '+91 9898989898',
      roleName: RoleName.DOCTOR,
      doctorProfile: {
        create: {
          specialization: 'General Medicine & Campus Physician',
          licenseNumber: 'MCI-2015-8849',
        },
      },
    },
    include: { doctorProfile: true },
  });

  // Doctor Availabilities
  if (doctorUser.doctorProfile) {
    await prisma.availability.createMany({
      data: [
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 1, startTime: '09:00', endTime: '13:00' },
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 2, startTime: '09:00', endTime: '13:00' },
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 3, startTime: '09:00', endTime: '13:00' },
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 4, startTime: '09:00', endTime: '13:00' },
        { doctorId: doctorUser.doctorProfile.id, dayOfWeek: 5, startTime: '09:00', endTime: '13:00' },
      ],
    });
  }

  // Admin User
  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Chief Medical Officer / Admin',
      roleName: RoleName.ADMIN,
    },
  });

  // Faculty User
  await prisma.user.create({
    data: {
      email: 'faculty@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Prof. Rajesh Gupta',
      roleName: RoleName.FACULTY,
      facultyProfile: {
        create: {
          employeeId: 'EMP-9021',
          department: 'Computer Science & Engineering',
        },
      },
    },
  });

  // Security User
  await prisma.user.create({
    data: {
      email: 'security@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Head Officer - Block A Security',
      roleName: RoleName.SECURITY,
    },
  });

  // Ambulance Driver User
  await prisma.user.create({
    data: {
      email: 'ambulance@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Ramesh Kumar (Ambulance Dispatch)',
      roleName: RoleName.AMBULANCE,
    },
  });

  // Warden User
  await prisma.user.create({
    data: {
      email: 'warden@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Mr. Suresh Nair (Block A Warden)',
      roleName: RoleName.WARDEN,
    },
  });

  // Pharmacy User
  await prisma.user.create({
    data: {
      email: 'pharmacy@demo.com',
      passwordHash: defaultPasswordHash,
      fullName: 'VIT Campus Pharmacy',
      roleName: RoleName.PHARMACY,
    },
  });

  // 5. Seed Symptom Questions
  console.log('❓ Seeding Symptom Questionnaire...');
  await prisma.symptomQuestion.createMany({
    data: [
      { questionText: 'Do you have fever?', category: 'GENERAL', inputType: 'YES_NO' },
      { questionText: 'Do you have severe headache?', category: 'NEUROLOGICAL', inputType: 'YES_NO' },
      { questionText: 'Do you experience body ache or muscle pain?', category: 'GENERAL', inputType: 'YES_NO' },
      { questionText: 'Do you have difficulty breathing or chest pain?', category: 'RESPIRATORY', inputType: 'YES_NO' },
      { questionText: 'Do you have nausea, vomiting, or abdominal cramps?', category: 'GASTROINTESTINAL', inputType: 'YES_NO' },
      { questionText: 'Do you feel unusually weak or fatigued?', category: 'GENERAL', inputType: 'YES_NO' },
      { questionText: 'How severe is your pain overall?', category: 'PAIN_SCALE', inputType: 'SCALE' },
    ],
  });

  // 6. Seed Medications (Pharmacy Inventory)
  console.log('💊 Seeding Medications...');
  await prisma.medication.createMany({
    data: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet 3 times a day', stockCount: 200 },
      { name: 'ORS Electrolyte Sachet', dosage: 'Dissolve in 1L water', stockCount: 150 },
      { name: 'Azithromycin 500mg', dosage: '1 tablet daily for 3 days', stockCount: 50 },
      { name: 'Cetirizine 10mg', dosage: '1 tablet at bedtime', stockCount: 100 },
      { name: 'Pantoprazole 40mg', dosage: '1 tablet before breakfast', stockCount: 80 },
      { name: 'Dextromethorphan Cough Syrup 100ml', dosage: '10ml thrice daily', stockCount: 60 },
    ],
  });

  // 7. Seed Smart Ambulances
  console.log('🚑 Seeding Ambulances...');
  await prisma.ambulance.createMany({
    data: [
      {
        vehicleNumber: 'MP-04-VT-1001',
        driverName: 'Ramesh Kumar',
        driverPhone: '+91 9988776655',
        status: AmbulanceStatus.AVAILABLE,
        currentLat: 23.0775,
        currentLng: 76.8513,
      },
      {
        vehicleNumber: 'MP-04-VT-1002',
        driverName: 'Suresh Singh',
        driverPhone: '+91 9988776656',
        status: AmbulanceStatus.AVAILABLE,
        currentLat: 23.0780,
        currentLng: 76.8520,
      },
    ],
  });

  // 8. Seed Disease Thresholds
  console.log('📊 Seeding Dynamic Disease Thresholds...');
  await prisma.diseaseThreshold.createMany({
    data: [
      {
        diseaseCategory: 'Food Poisoning',
        scope: DiseaseScope.FLOOR,
        thresholdCount: 10,
        timeWindowHours: 24,
        warningPercentage: 80,
      },
      {
        diseaseCategory: 'Viral Fever',
        scope: DiseaseScope.BLOCK,
        thresholdCount: 15,
        timeWindowHours: 48,
        warningPercentage: 75,
      },
      {
        diseaseCategory: 'Typhoid-like illness',
        scope: DiseaseScope.BLOCK,
        thresholdCount: 5,
        timeWindowHours: 48,
        warningPercentage: 60,
      },
      {
        diseaseCategory: 'Dengue-like symptoms',
        scope: DiseaseScope.BLOCK,
        thresholdCount: 3,
        timeWindowHours: 72,
        warningPercentage: 50,
      },
    ],
  });

  // 9. Seed Outbreak Simulation Data (Block A, Floor 3 Cluster)
  console.log('☣️ Seeding Simulated Outbreak Cluster Data (Block A, Floor 3)...');
  
  if (room301 && room302 && room303 && room304) {
    const clusterRooms = [room301.id, room302.id, room303.id, room304.id];
    
    // Seed 9 cases in Block A Floor 3 to bring count to 90% (Warning State for Food Poisoning Threshold of 10)
    for (let i = 1; i <= 9; i++) {
      const selectedRoomId = clusterRooms[i % clusterRooms.length];
      await prisma.diseaseCase.create({
        data: {
          diseaseCategory: 'Food Poisoning',
          isConfirmed: i <= 4, // First 4 are doctor-confirmed, rest suspected
          severity: i % 3 === 0 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM,
          roomId: selectedRoomId,
          reportedAt: new Date(Date.now() - (10 - i) * 3600 * 1000), // Spanned over last 10 hours
        },
      });
    }

    // Create an active OutbreakAlert record for Floor 3
    const foodPoisonThreshold = await prisma.diseaseThreshold.findFirst({
      where: { diseaseCategory: 'Food Poisoning' },
    });

    if (foodPoisonThreshold) {
      await prisma.outbreakAlert.create({
        data: {
          thresholdId: foodPoisonThreshold.id,
          scope: DiseaseScope.FLOOR,
          targetLocationName: 'Block A - Floor 3',
          status: AlertStatus.WARNING,
          currentCount: 9,
          thresholdCount: 10,
          predictedNextCount: 12,
          outbreakRisk: OutbreakRisk.HIGH,
          message: 'EARLY WARNING: 9 suspected cases of Food Poisoning reported in Block A - Floor 3 within 24 hours. Threshold is 10. LSTM model predicts 12 cases tomorrow.',
        },
      });
    }
  }

  console.log('✅ VIT-Health Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Seeded Credentials Overview:');
  console.log('  Student:   student@demo.com   / Demo@12345');
  console.log('  Doctor:    doctor@demo.com    / Demo@12345');
  console.log('  Admin:     admin@demo.com     / Demo@12345');
  console.log('  Faculty:   faculty@demo.com   / Demo@12345');
  console.log('  Security:  security@demo.com  / Demo@12345');
  console.log('  Ambulance: ambulance@demo.com / Demo@12345');
  console.log('  Warden:    warden@demo.com    / Demo@12345');
  console.log('  Pharmacy:  pharmacy@demo.com  / Demo@12345');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
