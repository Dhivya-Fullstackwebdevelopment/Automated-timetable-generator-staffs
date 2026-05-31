import { useEffect, useState } from "react";
import { getStaffFullTimetable } from "@/api/staffApi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const PERIOD_TIMES: Record<number, string> = {
  1: "09:00 AM - 09:50 AM",
  2: "09:50 AM - 10:40 AM",
  3: "10:50 AM - 11:40 AM",
  4: "11:40 AM - 12:30 PM",
  5: "01:20 PM - 02:10 PM",
  6: "02:10 PM - 03:00 PM",
  7: "03:10 PM - 04:00 PM",
  8: "04:00 PM - 04:50 PM",
};

const MyTimetable = () => {
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [semester, setSemester] = useState<string>("ODD"); // ✅ default ODD

  useEffect(() => {
    fetchTimetable(semester);
  }, [semester]); // ✅ refetch when semester changes

  const fetchTimetable = async (selectedSemester: string) => {
    setLoading(true);
    try {
      const loggedInStaff = JSON.parse(localStorage.getItem("staff") || "{}");
      const res = await getStaffFullTimetable(loggedInStaff.id, selectedSemester); // ✅ pass semester
      setStaff(res.data.staff);
      setTimetable(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSlot = (day: string, period: number) => {
    const dayData = timetable.find((d: any) => d.day === day);
    if (!dayData) return null;
    return dayData.periods.find((p: any) => p.period === period);
  };

  return (
    <div className="space-y-6">

      {/* Staff Details */}
      <div className="bg-white rounded-xl shadow-md p-5 border">
        <h2 className="text-2xl font-bold text-gray-800">{staff?.name}</h2>
        <p className="text-gray-500 mt-1">{staff?.department}</p>
        <p className="mt-2 text-sm">
          <span className="font-semibold">Subjects:</span> {staff?.subjects}
        </p>
      </div>

      {/* ✅ Semester Dropdown */}
      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-700">Semester:</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="ODD">ODD Semester</option>
          <option value="EVEN">EVEN Semester</option>
        </select>

        {loading && (
          <span className="text-sm text-gray-400 animate-pulse">
            Loading...
          </span>
        )}
      </div>

      {/* Timetable */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 min-w-[130px]">Day / Period</th>
              {PERIODS.map((period) => (
                <th key={period} className="border p-2 min-w-[180px]">
                  <div className="font-bold text-center">Period {period}</div>
                  <div className="text-[10px] text-gray-500 text-center mt-1">
                    {PERIOD_TIMES[period]}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <td className="border p-3 bg-gray-50 font-bold">{day}</td>
                {PERIODS.map((period) => {
                  const slot = getSlot(day, period);
                  const isClass = slot && slot.status !== "FREE" && slot.subject;

                  return (
                    <td key={period} className="border p-2 align-top">
                      {isClass ? (
                        <div className="bg-green-50 border border-green-400 rounded-lg p-2 h-full">
                          <p className="font-semibold text-green-800">{slot.subject}</p>
                          <p className="text-[11px] text-purple-700 font-medium mt-1">
                            {PERIOD_TIMES[period]}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{slot.year}</p>
                          <p className="text-xs text-gray-500">{slot.semester}</p>
                          <p className="text-xs text-gray-600">{slot.room}</p>
                          <p className="text-xs text-blue-600 mt-1">{slot.staff}</p>
                          <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded">
                            {slot.status?.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-6">Free</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default MyTimetable;