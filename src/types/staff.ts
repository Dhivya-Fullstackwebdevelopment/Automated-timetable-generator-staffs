export type InstitutionType = "School" | "College";

export type StaffStatus = "Active" | "Emergency Leave" | "Sick Leave" | "Resigned";

export interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  status: StaffStatus;
  institutionType: InstitutionType;
  joinedAt: string;
  phone: string;
}

export interface TimetableSlot {
  day: string;
  period: number;
  className: string;
  subject: string;
  room: string;
  staffId: string;
  isLab?: boolean;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  leaveType: "Emergency" | "Sick";
  fromDate: string;
  toDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Notification {
  id: string;
  departmentId: string;
  message: string;
  type: "Leave" | "Resigned";
  read: boolean;
  createdAt: string;
}

export interface WorkloadSummary {
  totalPeriods: number;
  subjectBreakdown: { subject: string; count: number }[];
  daysActive: number;
  averagePerDay: number;
}
