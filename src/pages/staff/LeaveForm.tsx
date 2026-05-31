import { useState } from "react";
import { useStaff } from "@/context/StaffContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/api/apiurl";
import { z } from "zod";

const leaveSchema = z
  .object({
    leave_type: z.string().min(1, "Leave type is required"),

    from_date: z.string().min(1, "From date is required"),

    to_date: z.string().min(1, "To date is required"),

    reason: z.string().min(3, "Reason is required"),
  })
  .refine(
    (data) => new Date(data.to_date) >= new Date(data.from_date),
    {
      message: "To Date must be greater than or equal to From Date",
      path: ["to_date"],
    }
  );

const LeaveForm = () => {

  const { staff } = useStaff();

  const [leaveType, setLeaveType] =
    useState("ACTIVE");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] = useState<{
    leave_type?: string;
    from_date?: string;
    to_date?: string;
    reason?: string;
  }>({});
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const result = leaveSchema.safeParse({
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
      reason: reason.trim(),
    });

    if (!result.success) {

      const err =
        result.error.flatten().fieldErrors;

      setErrors({
        leave_type: err.leave_type?.[0],
        from_date: err.from_date?.[0],
        to_date: err.to_date?.[0],
        reason: err.reason?.[0],
      });

      toast.error(
        err.leave_type?.[0] ||
        err.from_date?.[0] ||
        err.to_date?.[0] ||
        err.reason?.[0]
      );

      return;
    }

    try {

      setLoading(true);

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
        `${leaveType} leave applied successfully ✅`
      );

      setFromDate("");
      setToDate("");
      setReason("");
      setLeaveType("ACTIVE");

      setErrors({});

    } catch (error) {

      console.error(error);

      toast.error(
        "Leave apply failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-lg">

      <h2 className="text-xl font-display font-bold text-foreground mb-1">
        Apply for Leave
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Submit your leave request.
        A substitute will be auto-assigned.
      </p>

      <Card className="elevated-card">

        <CardContent className="pt-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* LEAVE TYPE */}
            <div className="space-y-2">

              <Label>
                Leave Type
              </Label>

              <Select
                value={leaveType}
                onValueChange={(v) => {

                  setLeaveType(v);

                  setErrors((prev) => ({
                    ...prev,
                    leave_type: undefined,
                  }));
                }}
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

                  {/* <SelectItem value="RESIGNED">
                    ❌ Resigned
                  </SelectItem> */}

                </SelectContent>

              </Select>

              {errors.leave_type && (
                <p className="text-red-500 text-sm">
                  {errors.leave_type}
                </p>
              )}

            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-2">

                <Label>
                  From Date
                </Label>

                <Input
                  type="date"
                  min={today}
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);

                    if (toDate && e.target.value > toDate) {
                      setToDate("");
                    }

                    setErrors((prev) => ({
                      ...prev,
                      from_date: undefined,
                    }));
                  }}
                />

                {errors.from_date && (
                  <p className="text-red-500 text-sm">
                    {errors.from_date}
                  </p>
                )}

              </div>

              <div className="space-y-2">

                <Label>
                  To Date
                </Label>

                <Input
                  type="date"
                  min={fromDate || today}
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      to_date: undefined,
                    }));
                  }}
                />

                {errors.to_date && (
                  <p className="text-red-500 text-sm">
                    {errors.to_date}
                  </p>
                )}

              </div>

            </div>

            {/* REASON */}
            <div className="space-y-2">

              <Label>
                Reason
              </Label>

              <Textarea
                placeholder="Brief reason for leave..."
                value={reason}
                rows={3}
                onChange={(e) => {

                  setReason(
                    e.target.value
                  );

                  setErrors((prev) => ({
                    ...prev,
                    reason: undefined,
                  }));
                }}
              />

              {errors.reason && (
                <p className="text-red-500 text-sm">
                  {errors.reason}
                </p>
              )}

            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground"
            >

              <Send className="w-4 h-4 mr-2" />

              {loading
                ? "Submitting..."
                : "Submit Leave Request"}

            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  );
};

export default LeaveForm;