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
import axios from "axios";
import { BASE_URL } from "@/api/apiurl";

const LeaveForm = () => {
  const { applyLeave, staff } = useStaff();
  const [leaveType, setLeaveType] = useState("ACTIVE");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {

      const payload = {
        staff: staff?.id,
        leave_type: leaveType,
        from_date: fromDate,
        to_date: toDate,
        reason: reason.trim(),
      };

      const res = await axios.post(
        `${BASE_URL}/api/leave/apply/`,
        payload
      );

      console.log(res.data);

      toast.success(
        `${leaveType} leave applied successfully`
      );
      setFromDate("");
      setToDate("");
      setReason("");

    } catch (error) {
      console.error(error);
      toast.error("Leave apply failed ❌");
    }
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
              <Select
                value={leaveType}
                onValueChange={setLeaveType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="ACTIVE">
                    ✅ Active
                  </SelectItem>

                  <SelectItem value="SICK">
                    🏥 Sick Leave
                  </SelectItem>

                  <SelectItem value="EMERGENCY">
                    🚨 Emergency Leave
                  </SelectItem>

                  <SelectItem value="RESIGNED">
                    ❌ Resigned
                  </SelectItem>

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
