import { DAYS, PERIODS } from "@/data/mockData";
import { useStaff } from "@/context/StaffContext";
import { TimetableSlot } from "@/types/staff";
import { FlaskConical, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// 1. Static times for each period
const periodTimes: Record<string | number, string> = {
  1: "09:00 AM - 09:50 AM",
  2: "09:50 AM - 10:40 AM",
  3: "10:50 AM - 11:40 AM",
  4: "11:40 AM - 12:30 PM",
  5: "01:20 PM - 02:10 PM",
  6: "02:10 PM - 03:00 PM",
  7: "03:10 PM - 04:00 PM",
  8: "04:00 PM - 04:50 PM",
};

// 2. Static assignments for OTHER staff (Added "section" to the details)
const staticOtherStaffAllocations: Record<string, { staffName: string; className: string; section: string; roomNo: string }> = {
  "Monday-3": { staffName: "Prof. Sharma", className: "BCA III Year", section: "A", roomNo: "Room 301" },
  "Monday-4": { staffName: "Dr. Anjali", className: "MCA I Year", section: "B", roomNo: "Lab 102" },
  "Monday-6": { staffName: "Mr. Ramesh", className: "BSc IT I Year", section: "A", roomNo: "Room 205" },
  "Tuesday-1": { staffName: "Mr. Karthik", className: "BCA I Year", section: "C", roomNo: "Room 105" },
  "Tuesday-2": { staffName: "Dr. Rajesh", className: "BSc CS II Year", section: "A", roomNo: "Room 204" },
  "Tuesday-4": { staffName: "Ms. Neha", className: "MCA II Year", section: "B", roomNo: "Lab 202" },
  "Wednesday-2": { staffName: "Ms. Priya", className: "MCA II Year", section: "A", roomNo: "Lab 201" },
  "Wednesday-3": { staffName: "Prof. Sharma", className: "BCA II Year", section: "B", roomNo: "Room 302" },
  "Thursday-1": { staffName: "Dr. Anjali", className: "BSc IT II Year", section: "A", roomNo: "Room 201" },
  "Thursday-5": { staffName: "Prof. Sharma", className: "BCA I Year", section: "C", roomNo: "Room 105" },
  "Friday-3": { staffName: "Dr. Anjali", className: "BSc CS I Year", section: "A", roomNo: "Lab 101" },
  "Friday-4": { staffName: "Mr. Karthik", className: "MCA III Year", section: "B", roomNo: "Room 305" },
  "Saturday-1": { staffName: "Dr. Rajesh", className: "BCA III Year", section: "A", roomNo: "Room 101" },
  "Saturday-4": { staffName: "Mr. Karthik", className: "MCA I Year", section: "A", roomNo: "Room 305" },
};

const MyTimetable = () => {
  const { timetable, staff } = useStaff();

  const getSlot = (day: string, period: number): TimetableSlot | undefined => {
    return timetable.find((s) => s.day === day && s.period === period && s.staffId === staff?.id);
  };

  const handleDownloadPDF = async () => {
    const originalInput = document.getElementById("timetable-download-container");
    if (!originalInput) return;

    try {
      const clone = originalInput.cloneNode(true) as HTMLElement;

      const cloneHeader = clone.querySelector("#pdf-header");
      if (cloneHeader) {
        cloneHeader.classList.remove("hidden");
        cloneHeader.classList.add("block");
      }

      const offScreenWrapper = document.createElement("div");
      offScreenWrapper.style.position = "absolute";
      offScreenWrapper.style.top = "-9999px";
      offScreenWrapper.style.left = "-9999px";
      offScreenWrapper.style.width = "1200px"; 
      document.body.appendChild(offScreenWrapper);
      
      offScreenWrapper.appendChild(clone);

      const canvas = await html2canvas(clone, { 
        scale: 2, 
        backgroundColor: "#ffffff",
        windowWidth: 1200
      });

      document.body.removeChild(offScreenWrapper);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      
      const pdfWidth = 297; 
      const pdfHeight = 210; 
      const margin = 10; 

      const maxImgWidth = pdfWidth - (margin * 2);
      const maxImgHeight = pdfHeight - (margin * 2);
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;
      
      // Calculate initial dimensions based on width
      let finalWidth = maxImgWidth;
      let finalHeight = finalWidth / imgRatio;

      // CRITICAL FIX: If the image is taller than the page, scale it down to fit the height!
      if (finalHeight > maxImgHeight) {
        finalHeight = maxImgHeight;
        finalWidth = finalHeight * imgRatio;
      }

      // Center horizontally if it was scaled down by height
      const xOffset = margin + (maxImgWidth - finalWidth) / 2;

      pdf.addImage(imgData, "PNG", xOffset, margin, finalWidth, finalHeight);
      
      const fileName = `${staff?.name ? staff.name.replace(/\s+/g, '_') : "Staff"}_Timetable.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const subjectColors: Record<string, string> = {};
  const colorPalette = [
    "bg-blue-50 border-blue-200 text-blue-800",
    "bg-emerald-50 border-emerald-200 text-emerald-800",
    "bg-purple-50 border-purple-200 text-purple-800",
    "bg-orange-50 border-orange-200 text-orange-800",
    "bg-pink-50 border-pink-200 text-pink-800",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">My Weekly Timetable</h2>
          <p className="text-sm text-muted-foreground">
            {staff?.institutionType === "College" ? "Department-based schedule" : "Class-based schedule"} · Mon–Sat · 8 periods
          </p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors w-fit shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download A4 PDF
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        {/* ENTIRE PDF CONTAINER */}
        <div 
          id="timetable-download-container" 
          className="min-w-[1100px] bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
        >
          {/* Printable Document Header - Hidden by default */}
          <div id="pdf-header" className="hidden mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-center text-gray-900 uppercase tracking-wide">
              YOUR COLLEGE NAME
            </h1>
            <p className="text-sm text-center text-gray-500 mb-4">
              123 Education Lane, City, State - ZIP Code
            </p>
            
            <div className="flex justify-between items-end px-2">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  Staff Name: <span className="text-primary">{staff?.name || "N/A"}</span>
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Department: {staff?.department || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Academic Year: 2023-2024</p>
                <p className="text-xs text-gray-500">
                  Generated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timetable Header Row */}
          <div className="grid grid-cols-9 gap-2 mb-2">
            <div className="p-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl flex items-center justify-center min-h-[60px]">
              Day / Period
            </div>
            {PERIODS.map((p) => (
              <div key={p} className="p-2 text-center bg-gray-100 rounded-xl flex flex-col items-center justify-center min-h-[60px]">
                <span className="text-sm font-bold text-gray-800">Period {p}</span>
                <span className="text-[10px] font-semibold text-gray-500 mt-1 whitespace-nowrap">{periodTimes[p] || "Time N/A"}</span>
              </div>
            ))}
          </div>

          {/* Timetable Body */}
          {DAYS.map((day) => (
            <div key={day} className="grid grid-cols-9 gap-2 mb-2">
              <div className="p-2 text-sm font-bold text-gray-700 bg-gray-50 rounded-xl flex items-center justify-center min-h-[110px]">
                {day}
              </div>
              
              {PERIODS.map((period) => {
                const mySlot = getSlot(day, period);
                const staticOtherSlot = staticOtherStaffAllocations[`${day}-${period}`];

                // 1. HIGHLIGHT YOUR CLASS
                if (mySlot) {
                  return (
                    <div
                      key={period}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 ${subjectColors[mySlot.subject] || "bg-gray-100 border-gray-300"} relative shadow-sm min-h-[110px] transition-all hover:scale-[1.02]`}
                    >
                      <div className="font-bold text-[12px] leading-normal text-center mb-1 text-wrap w-full">{mySlot.subject}</div>
                      <div className="text-[11px] font-semibold opacity-90 text-center leading-snug text-wrap w-full">
                        {mySlot.className} {mySlot.section ? `- Sec ${mySlot.section}` : ""}
                      </div>
                      <div className="text-[10px] opacity-75 text-center mt-1 leading-none text-wrap w-full">{mySlot.room}</div>
                      {mySlot.isLab && (
                        <FlaskConical className="absolute top-1 right-1 w-3 h-3 opacity-50" />
                      )}
                    </div>
                  );
                }

                // 2. OTHER STAFF
                if (staticOtherSlot) {
                  return (
                    <div key={period} className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 min-h-[110px]">
                      <span className="text-[11px] font-bold text-gray-500 text-center text-wrap w-full leading-normal mb-1">
                        {staticOtherSlot.staffName}
                      </span>
                      <span className="text-[10px] text-gray-400 text-center text-wrap w-full leading-snug mb-1">
                        {staticOtherSlot.className} - Sec {staticOtherSlot.section}
                      </span>
                      <span className="text-[10px] text-gray-400 text-center text-wrap w-full leading-none">
                        {staticOtherSlot.roomNo}
                      </span>
                    </div>
                  );
                }

                // 3. FREE PERIODS
                return (
                  <div key={period} className="flex items-center justify-center rounded-xl bg-transparent border border-gray-100 min-h-[110px]">
                    <span className="text-gray-300 text-xs font-medium">Free</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-sm font-bold text-gray-700 mr-2">Legend:</span>
            {Object.entries(subjectColors).map(([subject, color]) => (
              <div key={subject} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 ${color}`} />
                <span className="text-xs text-gray-700 font-medium">{subject}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <FlaskConical className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600 font-medium">Lab Session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-dashed border-gray-300 bg-gray-50/50" />
              <span className="text-xs text-gray-600 font-medium">Other Staff Assigned</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyTimetable;