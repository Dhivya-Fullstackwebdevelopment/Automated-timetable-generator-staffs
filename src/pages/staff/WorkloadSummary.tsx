import { useStaff } from "@/context/StaffContext";
import { DAYS } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, BookOpen, Calendar, TrendingUp } from "lucide-react";

const WorkloadSummary = () => {
  const { timetable, staff } = useStaff();

  const mySlots = timetable.filter((s) => s.staffId === staff?.id);
  const totalPeriods = mySlots.length;
  const activeDays = new Set(mySlots.map((s) => s.day)).size;
  const avgPerDay = activeDays > 0 ? (totalPeriods / activeDays).toFixed(1) : "0";

  const subjectBreakdown: Record<string, number> = {};
  mySlots.forEach((s) => {
    subjectBreakdown[s.subject] = (subjectBreakdown[s.subject] || 0) + 1;
  });

  const labCount = mySlots.filter((s) => s.isLab).length;

  const stats = [
    { label: "Total Periods", value: totalPeriods, icon: BookOpen, color: "text-primary" },
    { label: "Active Days", value: `${activeDays}/6`, icon: Calendar, color: "text-info" },
    { label: "Avg/Day", value: avgPerDay, icon: TrendingUp, color: "text-success" },
    { label: "Lab Sessions", value: labCount, icon: BarChart3, color: "text-accent" },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">Workload Summary</h2>
        <p className="text-sm text-muted-foreground">Weekly overview of your teaching load</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="elevated-card">
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="elevated-card">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Subject Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(subjectBreakdown).map(([subject, count]) => {
              const pct = totalPeriods > 0 ? (count / totalPeriods) * 100 : 0;
              return (
                <div key={subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{subject}</span>
                    <span className="text-muted-foreground">{count} periods ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="elevated-card">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Daily Distribution</h3>
          <div className="flex items-end gap-2 h-24">
            {DAYS.map((day) => {
              const count = mySlots.filter((s) => s.day === day).length;
              const height = totalPeriods > 0 ? (count / 8) * 100 : 0;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-foreground">{count}</span>
                  <div className="w-full bg-muted rounded-t-sm overflow-hidden" style={{ height: "80px" }}>
                    <div
                      className="w-full gradient-primary rounded-t-sm transition-all duration-500"
                      style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkloadSummary;
