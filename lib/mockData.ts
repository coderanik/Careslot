/**
 * Fallback seed data for local demo and offline viewing when Supabase is not configured.
 * Data matches seed/ps3_clinic_appointments.sql.
 */

export const MOCK_DEPARTMENTS = [
  { id: "D01", name: "General Medicine", common_issues: "fever, cold, cough, body pain, tiredness, general check-up, diabetes and BP follow-up" },
  { id: "D02", name: "Dermatology", common_issues: "skin rash, acne, itching, hair fall, allergy on skin, nail problems" },
  { id: "D03", name: "Pediatrics", common_issues: "children's health, vaccination, child fever, growth check-up" },
  { id: "D04", name: "Orthopedics", common_issues: "joint pain, back pain, knee pain, fracture, sports injury, neck pain" },
  { id: "D05", name: "Cardiology", common_issues: "chest discomfort, heart check-up, high BP, palpitations" },
  { id: "D06", name: "ENT", common_issues: "ear pain, sore throat, sinus, blocked nose, hearing problems" },
  { id: "D07", name: "Ophthalmology", common_issues: "eye pain, red eye, blurred vision, spectacles check-up" },
  { id: "D08", name: "Dental", common_issues: "tooth pain, cavity, gum bleeding, cleaning, braces" },
];

export const MOCK_DOCTORS = [
  { id: "DR01", name: "Dr. Kavitha Subramanian", department_id: "D01", qualification: "MBBS, MD", experience_years: 18, consultation_fee: 500, languages: ["English", "Tamil"], room: "G-01", departments: { id: "D01", name: "General Medicine" } },
  { id: "DR02", name: "Dr. Rajesh Kumar", department_id: "D01", qualification: "MBBS", experience_years: 7, consultation_fee: 400, languages: ["English", "Hindi", "Tamil"], room: "G-02", departments: { id: "D01", name: "General Medicine" } },
  { id: "DR03", name: "Dr. Nisha Menon", department_id: "D02", qualification: "MBBS, MD (Dermatology)", experience_years: 12, consultation_fee: 700, languages: ["English", "Malayalam", "Tamil"], room: "1-03", departments: { id: "D02", name: "Dermatology" } },
  { id: "DR04", name: "Dr. Farhan Ali", department_id: "D02", qualification: "MBBS, DDVL", experience_years: 6, consultation_fee: 600, languages: ["English", "Hindi", "Urdu"], room: "1-04", departments: { id: "D02", name: "Dermatology" } },
  { id: "DR05", name: "Dr. Sowmya Rao", department_id: "D03", qualification: "MBBS, MD (Pediatrics)", experience_years: 15, consultation_fee: 600, languages: ["English", "Kannada", "Tamil"], room: "1-05", departments: { id: "D03", name: "Pediatrics" } },
  { id: "DR06", name: "Dr. Prakash Iyer", department_id: "D04", qualification: "MBBS, MS (Ortho)", experience_years: 20, consultation_fee: 800, languages: ["English", "Tamil"], room: "2-01", departments: { id: "D04", name: "Orthopedics" } },
  { id: "DR07", name: "Dr. Anjali Deshmukh", department_id: "D04", qualification: "MBBS, DNB (Ortho)", experience_years: 9, consultation_fee: 700, languages: ["English", "Hindi", "Marathi"], room: "2-02", departments: { id: "D04", name: "Orthopedics" } },
  { id: "DR08", name: "Dr. Venkatesh Reddy", department_id: "D05", qualification: "MBBS, DM (Cardiology)", experience_years: 22, consultation_fee: 1000, languages: ["English", "Telugu", "Tamil"], room: "2-05", departments: { id: "D05", name: "Cardiology" } },
  { id: "DR09", name: "Dr. Meenakshi Sundaram", department_id: "D06", qualification: "MBBS, MS (ENT)", experience_years: 14, consultation_fee: 600, languages: ["English", "Tamil"], room: "1-07", departments: { id: "D06", name: "ENT" } },
  { id: "DR10", name: "Dr. Arvind Joshi", department_id: "D06", qualification: "MBBS, DLO", experience_years: 5, consultation_fee: 500, languages: ["English", "Hindi"], room: "1-08", departments: { id: "D06", name: "ENT" } },
  { id: "DR11", name: "Dr. Fathima Begum", department_id: "D07", qualification: "MBBS, MS (Ophthalmology)", experience_years: 11, consultation_fee: 600, languages: ["English", "Tamil", "Urdu"], room: "G-05", departments: { id: "D07", name: "Ophthalmology" } },
  { id: "DR12", name: "Dr. Sanjay Gupta", department_id: "D07", qualification: "MBBS, DO", experience_years: 8, consultation_fee: 500, languages: ["English", "Hindi"], room: "G-06", departments: { id: "D07", name: "Ophthalmology" } },
  { id: "DR13", name: "Dr. Divya Krishnan", department_id: "D08", qualification: "BDS, MDS", experience_years: 10, consultation_fee: 400, languages: ["English", "Tamil", "Malayalam"], room: "G-08", departments: { id: "D08", name: "Dental" } },
  { id: "DR14", name: "Dr. Harish Babu", department_id: "D08", qualification: "BDS", experience_years: 4, consultation_fee: 300, languages: ["English", "Tamil", "Telugu"], room: "G-09", departments: { id: "D08", name: "Dental" } },
  { id: "DR15", name: "Dr. Lalitha Ramesh", department_id: "D01", qualification: "MBBS, DNB (Family Medicine)", experience_years: 13, consultation_fee: 450, languages: ["English", "Tamil", "Kannada"], room: "G-03", departments: { id: "D01", name: "General Medicine" } },
];

export function getMockAppointments(status?: string, role = "patient") {
  const all = [
    {
      id: 101,
      patient_id: "P001",
      patient_name: "Arjun Mehta",
      patient_phone: "98400 12345",
      patient_age: 29,
      doctor_id: "DR01",
      doctor_name: "Dr. Kavitha Subramanian",
      room: "G-01",
      reason: "Follow-up for fever and cold",
      status: "booked",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      start_time: "09:30",
    },
    {
      id: 102,
      patient_id: "P001",
      patient_name: "Arjun Mehta",
      patient_phone: "98400 12345",
      patient_age: 29,
      doctor_id: "DR03",
      doctor_name: "Dr. Nisha Menon",
      room: "1-03",
      reason: "Skin allergy checkup",
      status: "booked",
      date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      start_time: "11:00",
    },
    {
      id: 99,
      patient_id: "P001",
      patient_name: "Arjun Mehta",
      patient_phone: "98400 12345",
      patient_age: 29,
      doctor_id: "DR06",
      doctor_name: "Dr. Prakash Iyer",
      room: "2-01",
      reason: "Knee discomfort after running",
      status: "cancelled",
      date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
      start_time: "10:00",
    },
  ];

  if (status && status !== "all") {
    return all.filter((a) => a.status === status);
  }
  return all;
}

