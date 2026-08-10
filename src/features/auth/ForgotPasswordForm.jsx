import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const errorMessages = {
  "auth/user-not-found": "No account found with this email.",
  "auth/invalid-email": "Please enter a valid email address.",
};

export default function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [firebaseError, setFirebaseError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  const onSubmit = async ({ email }) => {
    setFirebaseError("");
    setSuccessMessage("");
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setFirebaseError(errorMessages[err.code] || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {firebaseError && <Alert variant="danger">{firebaseError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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

      <Button type="submit" variant="primary" className="w-100 mb-3" disabled={submitting}>
        {submitting ? "Sending..." : "Send Reset Email"}
      </Button>

      <div className="text-center">
        <Link to="/login">Back to Log In</Link>
      </div>
    </Form>
  );
}