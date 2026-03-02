import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StaffProvider } from "@/context/StaffContext";
import StaffLogin from "./pages/staff/StaffLogin";
import StaffDashboard from "./pages/staff/StaffDashboard";
import DashboardHome from "./pages/staff/DashboardHome";
import MyTimetable from "./pages/staff/MyTimetable";
import LeaveForm from "./pages/staff/LeaveForm";
import WorkloadSummary from "./pages/staff/WorkloadSummary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StaffProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StaffLogin />} />

            <Route path="/college/staff-dashboard" element={<StaffDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="timetable" element={<MyTimetable />} />
              <Route path="leave" element={<LeaveForm />} />
              <Route path="workload" element={<WorkloadSummary />} />
            </Route>

            <Route path="/school/staff-dashboard" element={<StaffDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="timetable" element={<MyTimetable />} />
              <Route path="leave" element={<LeaveForm />} />
              <Route path="workload" element={<WorkloadSummary />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StaffProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
