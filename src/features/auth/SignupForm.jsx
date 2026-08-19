import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const errorMessages = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/account-exists-with-different-credential":
    "This email is already registered with a different sign-in method. Please log in the way you signed up the first time.",
};

export default function SignupForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async ({ email, password }) => {
    setFirebaseError("");
    setSubmitting(true);
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setFirebaseError("");
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "Google sign-in failed. Please try again.");
    }
  };

  const handleGithubSignup = async () => {
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          isInvalid={!!errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          isInvalid={!!errors.confirmPassword}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 mb-3" disabled={submitting}>
        {submitting ? "Creating account..." : "Sign Up"}
      </Button>

      <div className="d-flex align-items-center mb-3">
        <hr className="flex-grow-1" />
        <span className="px-2 text-muted small">or</span>
        <hr className="flex-grow-1" />
      </div>

      <Button variant="outline-secondary" className="w-100 mb-2" onClick={handleGoogleSignup}>
        Continue with Google
      </Button>
      <Button variant="outline-dark" className="w-100 mb-3" onClick={handleGithubSignup}>
        Continue with GitHub
      </Button>

      <div className="text-center">
        <Link to="/login">Already have an account? Log in</Link>
      </div>
    </Form>
  );
}