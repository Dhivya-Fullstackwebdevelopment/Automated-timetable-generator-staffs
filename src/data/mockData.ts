import { Staff, TimetableSlot, Notification } from "@/types/staff";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export const mockStaff: Staff = {
  id: "staff-001",
  name: "Mr. Rajesh Kumar",
  email: "rajesh.kumar@school.edu",
  department: "Computer Science",
  subjects: ["Data Structures", "Python Programming", "Database Systems"],
  status: "Active",
  institutionType: "College",
  joinedAt: "2023-06-15",
  phone: "+91 98765 43210",
};

export const mockSchoolStaff: Staff = {
  id: "staff-002",
  name: "Mrs. Priya Sharma",
  email: "priya.sharma@school.edu",
  department: "Mathematics",
  subjects: ["Mathematics", "Statistics"],
  status: "Active",
  institutionType: "School",
  joinedAt: "2022-01-10",
  phone: "+91 87654 32109",
};

export const mockTimetable: TimetableSlot[] = [
  { day: "Monday", period: 1, className: "BCA II Year", subject: "Data Structures", room: "Lab 201", staffId: "staff-001" },
  { day: "Monday", period: 2, className: "BCA II Year", subject: "Data Structures", room: "Lab 201", staffId: "staff-001", isLab: true },
  { day: "Monday", period: 5, className: "BCA I Year", subject: "Python Programming", room: "Room 105", staffId: "staff-001" },
  { day: "Tuesday", period: 2, className: "BCA III Year", subject: "Database Systems", room: "Room 301", staffId: "staff-001" },
  { day: "Tuesday", period: 3, className: "BCA III Year", subject: "Database Systems", room: "Room 301", staffId: "staff-001" },
  { day: "Tuesday", period: 6, className: "BCA I Year", subject: "Python Programming", room: "Lab 102", staffId: "staff-001", isLab: true },
  { day: "Tuesday", period: 7, className: "BCA I Year", subject: "Python Programming", room: "Lab 102", staffId: "staff-001", isLab: true },
  { day: "Wednesday", period: 1, className: "BCA II Year", subject: "Data Structures", room: "Room 201", staffId: "staff-001" },
  { day: "Wednesday", period: 4, className: "BCA III Year", subject: "Database Systems", room: "Lab 301", staffId: "staff-001", isLab: true },
  { day: "Wednesday", period: 5, className: "BCA III Year", subject: "Database Systems", room: "Lab 301", staffId: "staff-001", isLab: true },
  { day: "Thursday", period: 2, className: "BCA I Year", subject: "Python Programming", room: "Room 105", staffId: "staff-001" },
  { day: "Thursday", period: 3, className: "BCA II Year", subject: "Data Structures", room: "Room 201", staffId: "staff-001" },
  { day: "Thursday", period: 7, className: "BCA III Year", subject: "Database Systems", room: "Room 301", staffId: "staff-001" },
  { day: "Friday", period: 1, className: "BCA I Year", subject: "Python Programming", room: "Lab 102", staffId: "staff-001", isLab: true },
  { day: "Friday", period: 2, className: "BCA I Year", subject: "Python Programming", room: "Lab 102", staffId: "staff-001", isLab: true },
  { day: "Friday", period: 5, className: "BCA II Year", subject: "Data Structures", room: "Lab 201", staffId: "staff-001", isLab: true },
  { day: "Friday", period: 6, className: "BCA II Year", subject: "Data Structures", room: "Lab 201", staffId: "staff-001", isLab: true },
  { day: "Saturday", period: 1, className: "BCA III Year", subject: "Database Systems", room: "Room 301", staffId: "staff-001" },
  { day: "Saturday", period: 3, className: "BCA II Year", subject: "Data Structures", room: "Room 201", staffId: "staff-001" },
];

export const mockNotifications: Notification[] = [
  { id: "n1", departmentId: "cs", message: "Mrs. Anita is on Emergency Leave from Computer Science Department", type: "Leave", read: false, createdAt: "2026-03-01T10:00:00" },
  { id: "n2", departmentId: "cs", message: "Mr. Suresh has resigned from Computer Science Department", type: "Resigned", read: false, createdAt: "2026-02-28T14:30:00" },
  { id: "n3", departmentId: "cs", message: "Dr. Meena is on Sick Leave from Computer Science Department", type: "Leave", read: true, createdAt: "2026-02-27T09:15:00" },
];

export const substituteStaff: Staff[] = [
  { id: "staff-010", name: "Dr. Meena Rao", email: "meena@school.edu", department: "Computer Science", subjects: ["Data Structures", "Algorithms"], status: "Active", institutionType: "College", joinedAt: "2021-03-01", phone: "+91 99887 11223" },
  { id: "staff-011", name: "Mr. Sunil Verma", email: "sunil@school.edu", department: "Computer Science", subjects: ["Python Programming", "Java"], status: "Active", institutionType: "College", joinedAt: "2022-07-15", phone: "+91 99887 44556" },
];
