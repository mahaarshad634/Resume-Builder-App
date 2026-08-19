import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const errorMessages = {
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/account-exists-with-different-credential":
    "This email is already registered with a different sign-in method. Please log in the way you signed up the first time.",
};

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    setFirebaseError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFirebaseError("");
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "Google sign-in failed. Please try again.");
    }
  };

  const handleGithubLogin = async () => {
    setFirebaseError("");
    try {
      await loginWithGithub();
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "GitHub sign-in failed. Please try again.");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {firebaseError && <Alert variant="danger">{firebaseError}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          isInvalid={!!errors.email}
          {...register("email", { required: "Email is required" })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          isInvalid={!!errors.password}
          {...register("password", { required: "Password is required" })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 mb-3" disabled={submitting}>
        {submitting ? "Logging in..." : "Log In"}
      </Button>

      <div className="d-flex align-items-center mb-3">
        <hr className="flex-grow-1" />
        <span className="px-2 text-muted small">or</span>
        <hr className="flex-grow-1" />
      </div>

      <Button variant="outline-secondary" className="w-100 mb-2" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
      <Button variant="outline-dark" className="w-100 mb-3" onClick={handleGithubLogin}>
        Continue with GitHub
      </Button>

      <div className="d-flex justify-content-between">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/signup">Create an account</Link>
      </div>
    </Form>
  );
}