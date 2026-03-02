import { DAYS, PERIODS } from "@/data/mockData";
import { useStaff } from "@/context/StaffContext";
import { TimetableSlot } from "@/types/staff";
import { FlaskConical } from "lucide-react";

const MyTimetable = () => {
  const { timetable, staff } = useStaff();

  const getSlot = (day: string, period: number): TimetableSlot | undefined => {
    return timetable.find((s) => s.day === day && s.period === period && s.staffId === staff?.id);
  };

  const subjectColors: Record<string, string> = {};
  const colorPalette = [
    "bg-primary/10 border-primary/25 text-primary",
    "bg-accent/10 border-accent/25 text-accent",
    "bg-info/10 border-info/25 text-info",
    "bg-success/10 border-success/25 text-success",
    "bg-destructive/10 border-destructive/25 text-destructive",
  ];

  let colorIdx = 0;
  timetable.forEach((s) => {
    if (!subjectColors[s.subject]) {
      subjectColors[s.subject] = colorPalette[colorIdx % colorPalette.length];
      colorIdx++;
    }
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground">My Weekly Timetable</h2>
        <p className="text-sm text-muted-foreground">
          {staff?.institutionType === "College" ? "Department-based schedule" : "Class-based schedule"} · Mon–Sat · 8 periods
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-9 gap-1 mb-1">
            <div className="p-2 text-xs font-semibold text-muted-foreground">Day / Period</div>
            {PERIODS.map((p) => (
              <div key={p} className="p-2 text-xs font-semibold text-center text-muted-foreground bg-muted rounded-md">
                P{p}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day) => (
            <div key={day} className="grid grid-cols-9 gap-1 mb-1">
              <div className="p-2 text-xs font-semibold text-foreground flex items-center">
                {day.slice(0, 3)}
              </div>
              {PERIODS.map((period) => {
                const slot = getSlot(day, period);
                if (!slot) {
                  return (
                    <div key={period} className="timetable-cell flex items-center justify-center">
                      <span className="text-muted-foreground/40">—</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={period}
                    className={`timetable-cell timetable-cell-active ${subjectColors[slot.subject] || ""} relative`}
                  >
                    <div className="font-semibold text-[11px] leading-tight truncate">{slot.subject}</div>
                    <div className="text-[10px] opacity-70 truncate">{slot.className}</div>
                    <div className="text-[10px] opacity-60 truncate">{slot.room}</div>
                    {slot.isLab && (
                      <FlaskConical className="absolute top-1 right-1 w-3 h-3 opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(subjectColors).map(([subject, color]) => (
          <div key={subject} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm border ${color}`} />
            <span className="text-xs text-muted-foreground">{subject}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Lab Session</span>
        </div>
      </div>
    </div>
  );
};

export default MyTimetable;
