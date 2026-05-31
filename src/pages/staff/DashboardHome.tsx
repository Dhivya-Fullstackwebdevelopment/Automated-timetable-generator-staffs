import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/apiurl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BookOpen,
  CalendarDays,
  Clock,
  Mail,
  TrendingUp,
} from "lucide-react";

interface DashboardData {
  staff: {
    id: number;
    name: string;
    email: string;
    department: string;
    status: string;
    subjects: string;
    joined: string;
  };
  stats: {
    total_periods: number;
    today_classes: number;
    subjects: number;
    active_days: string;
  };
  leave_summary: {
    sick: number;
    emergency: number;
    resigned: number;
  };
  today: string;
  today_schedule: any[];
}

const DashboardHome = () => {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const savedStaff = JSON.parse(
        localStorage.getItem("staff") || "{}"
      );

      if (!savedStaff?.id) {
        console.log("No staff found");
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/timetable/staff-dashboard/${savedStaff.id}/`
      );

      console.log("Dashboard API:", res.data);

      setDashboard(res.data.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500">
        Dashboard data not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-primary" />

        <CardContent className="relative pt-0 pb-5 px-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 flex items-center justify-center shadow-lg">
              <User className="w-7 h-7" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                  {dashboard.staff.name}
                </h2>

                <Badge>
                  {dashboard.staff.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {dashboard.staff.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              {dashboard.staff.email}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" />
              {dashboard.staff.subjects}
            </div>

            {/* <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4" />
              {dashboard.staff.joined || "N/A"}
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <BookOpen className="w-5 h-5 mb-2 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {dashboard.stats.total_periods}
            </h2>
            <p className="text-sm text-muted-foreground">
              Total Periods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Clock className="w-5 h-5 mb-2 text-green-500" />
            <h2 className="text-2xl font-bold">
              {dashboard.stats.today_classes}
            </h2>
            <p className="text-sm text-muted-foreground">
              Today's Classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <TrendingUp className="w-5 h-5 mb-2 text-purple-500" />
            <h2 className="text-2xl font-bold">
              {dashboard.stats.subjects}
            </h2>
            <p className="text-sm text-muted-foreground">
              Subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <CalendarDays className="w-5 h-5 mb-2 text-orange-500" />
            <h2 className="text-2xl font-bold">
              {dashboard.stats.active_days}
            </h2>
            <p className="text-sm text-muted-foreground">
              Active Days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Summary */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">
            Leave Summary
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {dashboard.leave_summary.sick}
              </h2>
              <p>Sick Leave</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {dashboard.leave_summary.emergency}
              </h2>
              <p>Emergency Leave</p>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {dashboard.leave_summary.resigned}
              </h2>
              <p>Resigned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4">
            Today's Schedule - {dashboard.today}
          </h3>

          {dashboard.today_schedule.length === 0 ? (
            <p className="text-muted-foreground">
              No classes scheduled today 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {dashboard.today_schedule.map(
                (slot: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3"
                  >
                    <p className="font-medium">
                      {slot.subject}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {slot.class_name}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;