import { useStaff } from "@/context/StaffContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/api/apiurl";

const ResignModal = () => {
  const { logout } = useStaff();
  const navigate = useNavigate();

  const handleResign = async () => {
    try {
      // ✅ Get staff id from localStorage
      const staffData = JSON.parse(localStorage.getItem("staff") || "{}");

      const res = await axios.post(`${BASE_URL}/api/leave/resign/`, {
        staff_id: staffData.id
      });

      if (res.data.status) {
        toast.success("Resignation submitted successfully ✅");

        // ✅ Logout and redirect after 2 seconds
        setTimeout(() => {
          logout();
          localStorage.removeItem("staff");
          navigate("/");
        }, 2000);

      } else {
        toast.error(res.data.message || "Resignation failed ❌");
      }

    } catch (error) {
      console.error(error);
      toast.error("Resignation failed. Please try again ❌");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <LogOut className="w-4 h-4" />
          Resign
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Resignation</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent. Your status will be set to "Resigned",
            all your timetable slots will be removed, and a department
            notification will be generated. The timetable will be automatically
            regenerated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResign}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Resign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResignModal;