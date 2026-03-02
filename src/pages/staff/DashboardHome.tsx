import { useStaff } from "@/context/StaffContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, CalendarDays, Clock, Building, Phone, Mail, TrendingUp } from "lucide-react";
import { DAYS } from "@/data/mockData";

const DashboardHome = () => {
  const { staff, timetable } = useStaff();
  if (!staff) return null;

  const mySlots = timetable.filter((s) => s.staffId === staff.id);
  const todayName = DAYS[new Date().getDay() - 1] || "Monday";
  const todaySlots = mySlots.filter((s) => s.day === todayName).sort((a, b) => a.period - b.period);

  const statusColor: Record<string, string> = {
    Active: "bg-success/10 text-success border-success/20",
    "Emergency Leave": "bg-warning/10 text-warning border-warning/20",
    "Sick Leave": "bg-info/10 text-info border-info/20",
    Resigned: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Card */}
      <Card className="elevated-card overflow-hidden">
        <div className="h-20 gradient-primary" />
        <CardContent className="relative pt-0 pb-5 px-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
            <div className="w-16 h-16 rounded-2xl bg-card border-4 border-card flex items-center justify-center gradient-primary shadow-lg">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-display font-bold text-foreground">{staff.name}</h2>
                <Badge className={`text-[10px] ${statusColor[staff.status] || ""}`}>{staff.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{staff.department} Department</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { icon: Mail, label: staff.email },
              { icon: Phone, label: staff.phone },
              { icon: Building, label: staff.institutionType },
              { icon: CalendarDays, label: `Joined ${new Date(staff.joinedAt).toLocaleDateString()}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Periods", value: mySlots.length, icon: BookOpen, color: "text-primary" },
          { label: "Today's Classes", value: todaySlots.length, icon: Clock, color: "text-accent" },
          { label: "Subjects", value: new Set(mySlots.map((s) => s.subject)).size, icon: TrendingUp, color: "text-info" },
          { label: "Active Days", value: `${new Set(mySlots.map((s) => s.day)).size}/6`, icon: CalendarDays, color: "text-success" },
        ].map((stat) => (
          <Card key={stat.label} className="elevated-card">
            <CardContent className="p-4">
              <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card className="elevated-card">
        <CardContent className="p-5">
          <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Today's Schedule — {todayName}
          </h3>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No classes scheduled for today 🎉</p>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((slot, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                    P{slot.period}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{slot.subject}</p>
                    <p className="text-xs text-muted-foreground">{slot.className} · {slot.room}</p>
                  </div>
                  {slot.isLab && (
                    <Badge variant="secondary" className="text-[10px]">Lab</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
