# VIT-Health Database Documentation

## Schema & Entities
The database uses PostgreSQL with Prisma ORM.

### Key Domain Modules
1. **User & Auth**: `User`, `Role`
2. **Campus Hierarchy**: `Hostel` → `Block` → `Floor` → `Room`
3. **User Profiles**: `StudentProfile`, `DoctorProfile`, `FacultyProfile`
4. **Symptom Checker & AI**: `SymptomQuestion`, `SymptomReport`, `AIPrediction`, `AIFeedback`
5. **Clinical Workflow**: `Appointment`, `Availability`, `Consultation`, `MedicalRecord`, `Prescription`
6. **Surveillance & Alerts**: `DiseaseCase`, `DiseaseThreshold`, `OutbreakAlert`
7. **Emergency & Ambulance**: `EmergencyCase`, `Ambulance`, `AmbulanceLocation`
8. **Pharmacy & Mental Health**: `Medication`, `MedicineOrder`, `MentalHealthScreening`
