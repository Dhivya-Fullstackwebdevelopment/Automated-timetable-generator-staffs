import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStaff } from "@/context/StaffContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  LayoutDashboard, CalendarDays, FileWarning, HeartPulse,
  LogOut, Bell, User, BarChart3, GraduationCap, Menu, X,
} from "lucide-react";
import ResignModal from "./ResignModal";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "" },
  { label: "Timetable", icon: CalendarDays, path: "timetable" },
  { label: "Apply Leave", icon: HeartPulse, path: "leave" },
  { label: "Workload", icon: BarChart3, path: "workload" },
];

const StaffDashboard = () => {
  const { staff, notifications, markNotificationRead, logout } = useStaff();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const basePath = staff?.institutionType === "School" ? "/school/staff-dashboard" : "/college/staff-dashboard";

  const isActive = (path: string) => {
    if (path === "") return location.pathname === basePath;
    return location.pathname.includes(path);
  };

  const handleNav = (path: string) => {
    navigate(path ? `${basePath}/${path}` : basePath);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!staff) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 gradient-sidebar transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:block`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sidebar-foreground text-sm">ATMS</h2>
              <p className="text-[10px] text-sidebar-foreground/60">{staff.institutionType} Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-sidebar-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2 pt-4 border-t border-sidebar-border">
            <ResignModal />
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display font-bold text-foreground text-lg">
                {navItems.find((n) => isActive(n.path))?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 badge-notification">{unreadCount}</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                          !n.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                          <div className={!n.read ? "" : "ml-4"}>
                            <p className="text-xs text-foreground">{n.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={n.type === "Resigned" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                                {n.type}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-foreground leading-none">{staff.name}</p>
                <p className="text-[10px] text-muted-foreground">{staff.department}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
