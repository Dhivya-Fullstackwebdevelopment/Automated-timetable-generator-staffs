import { useState } from "react";
import { useStaff } from "@/context/StaffContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Send } from "lucide-react";
import { toast } from "sonner";

const LeaveForm = () => {
  const { applyLeave, staff } = useStaff();
  const [leaveType, setLeaveType] = useState<"Emergency" | "Sick">("Emergency");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    applyLeave({
      staffId: staff?.id || "",
      leaveType,
      fromDate,
      toDate,
      reason: reason.trim(),
    });
    toast.success(`${leaveType} leave applied successfully. Timetable will be regenerated.`);
    setFromDate("");
    setToDate("");
    setReason("");
  };

  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="text-xl font-display font-bold text-foreground mb-1">Apply for Leave</h2>
      <p className="text-sm text-muted-foreground mb-4">Submit your leave request. A substitute will be auto-assigned.</p>

      <Card className="elevated-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={(v) => setLeaveType(v as "Emergency" | "Sick")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emergency">🚨 Emergency Leave</SelectItem>
                  <SelectItem value="Sick">🏥 Sick Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Brief reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground">
              <Send className="w-4 h-4 mr-2" />
              Submit Leave Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveForm;
