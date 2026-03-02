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

const ResignModal = () => {
  const { resign, logout } = useStaff();
  const navigate = useNavigate();

  const handleResign = () => {
    resign();
    toast.success("Resignation submitted. Your timetable slots have been reassigned.");
    setTimeout(() => {
      logout();
      navigate("/");
    }, 2000);
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
            This action is permanent. Your status will be set to "Resigned", all your timetable slots will be removed, and a department notification will be generated. The timetable will be automatically regenerated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleResign} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, Resign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResignModal;
