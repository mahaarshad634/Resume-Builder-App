import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const errorMessages = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
};

export default function SignupForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {firebaseError && <Alert variant="danger">{firebaseError}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="you@example.com"
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

      <div className="text-center">
        <Link to="/login">Already have an account? Log in</Link>
      </div>
    </Form>
  );
}