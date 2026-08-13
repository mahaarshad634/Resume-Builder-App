import { UserPlus } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import SignupForm from "../features/auth/SignupForm";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  return (
    <AuthLayout>
       <div className="d-flex justify-content-end mb-3">
              <ThemeToggle />
            </div>

      <div className="d-flex align-items-center gap-2 mb-1">
        <UserPlus size={22} color="var(--color-primary)" />
        <h3 className="mb-0">Create Account</h3>
      </div>
      <p className="text-muted mb-4">Start building your resume in minutes.</p>
      <SignupForm />
    </AuthLayout>
  );
}