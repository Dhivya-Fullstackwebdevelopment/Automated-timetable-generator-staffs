import React, { createContext, useContext, useState, ReactNode } from "react";
import { Staff, TimetableSlot, Notification, LeaveRequest, StaffStatus } from "@/types/staff";
import { mockStaff, mockTimetable, mockNotifications, substituteStaff } from "@/data/mockData";

interface StaffContextType {
  staff: Staff | null;
  setStaff: (s: Staff | null) => void;
  timetable: TimetableSlot[];
  setTimetable: (t: TimetableSlot[]) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  leaveRequests: LeaveRequest[];
  applyLeave: (req: Omit<LeaveRequest, "id" | "createdAt" | "status">) => void;
  resign: () => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const StaffContext = createContext<StaffContextType | null>(null);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(mockTimetable);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (email: string, _password: string): boolean => {
    // Mock login - accept any credentials
    const staffData = email.includes("school") ? { ...mockStaff, institutionType: "School" as const, email } : { ...mockStaff, email };
    setStaff(staffData);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setStaff(null);
    setIsLoggedIn(false);
  };

  const addNotification = (n: Omit<Notification, "id" | "createdAt">) => {
    setNotifications((prev) => [
      { ...n, id: `n-${Date.now()}`, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const regenerateTimetable = (staffId: string) => {
    // Find affected slots
    const affectedSlots = timetable.filter((s) => s.staffId === staffId);
    const updatedTimetable = timetable.map((slot) => {
      if (slot.staffId !== staffId) return slot;
      // Find substitute
      const sub = substituteStaff.find(
        (s) => s.status === "Active" && s.subjects.some((subj) => subj === slot.subject)
      );
      if (sub) {
        return { ...slot, staffId: sub.id };
      }
      return slot;
    });
    setTimetable(updatedTimetable);
  };

  const applyLeave = (req: Omit<LeaveRequest, "id" | "createdAt" | "status">) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lr-${Date.now()}`,
      status: "Approved",
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests((prev) => [...prev, newReq]);

    const newStatus: StaffStatus = req.leaveType === "Emergency" ? "Emergency Leave" : "Sick Leave";
    if (staff) {
      setStaff({ ...staff, status: newStatus });
      addNotification({
        departmentId: staff.department.toLowerCase().replace(/\s/g, "-"),
        message: `${staff.name} is on ${newStatus} from ${staff.department} Department`,
        type: "Leave",
        read: false,
      });
      regenerateTimetable(staff.id);
    }
  };

  const resign = () => {
    if (staff) {
      setStaff({ ...staff, status: "Resigned" });
      addNotification({
        departmentId: staff.department.toLowerCase().replace(/\s/g, "-"),
        message: `${staff.name} has resigned from ${staff.department} Department`,
        type: "Resigned",
        read: false,
      });
      // Remove from timetable
      setTimetable((prev) => prev.filter((s) => s.staffId !== staff.id));
    }
  };

  return (
    <StaffContext.Provider
      value={{
        staff, setStaff, timetable, setTimetable, notifications,
        addNotification, markNotificationRead, leaveRequests,
        applyLeave, resign, isLoggedIn, login, logout,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used within StaffProvider");
  return ctx;
}
