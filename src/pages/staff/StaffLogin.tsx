import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaff } from "@/context/StaffContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap, Lock, Mail } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/api/apiurl";
import { toast } from "sonner";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useStaff();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {

      const res = await axios.post(
        `${BASE_URL}/api/timetable/staff-login/`,
        {
          email,
          password,
        }
      );

      console.log(res.data);

      if (res.data.status) {

        const staffData = {
          id: res.data.data.id,
          name: res.data.data.name,
          email: res.data.data.email,
          department: res.data.data.department,
          institutionType:
            res.data.data.department_type == 1
              ? "School"
              : "College",
          status: res.data.data.status,
        };

        localStorage.setItem(
          "staff",
          JSON.stringify(staffData)
        );

        toast.success("Login successful ✅");

        if (res.data.data.department_type == 1) {
          navigate("/school/staff-dashboard");
        } else {
          navigate("/college/staff-dashboard");
        }

        window.location.reload();

      } else {
        toast.error("Invalid credentials");
      }

    } catch (error) {
      console.error(error);

      toast.error("Login failed ❌");

      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md animate-fade-in elevated-card">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Staff Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Automated Timetable Management System
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground">
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Use any email to login. Include "school" for School mode.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffLogin;
