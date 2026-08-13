import { LogIn } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../features/auth/LoginForm";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  return (
    <AuthLayout>
      <div className="d-flex justify-content-end mb-3">
        <ThemeToggle />
      </div>

      <div className="d-flex align-items-center gap-2 mb-1">
        <LogIn size={22} color="var(--color-primary)" />
        <h3 className="mb-0">Log In</h3>
      </div>
      <p className="text-muted mb-4">Welcome back — pick up where you left off.</p>
      <LoginForm />
    </AuthLayout>
  );
}