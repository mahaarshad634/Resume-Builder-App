import { Container, Row, Col, Card } from "react-bootstrap";
import ForgotPasswordForm from "../features/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4">
            <h3 className="mb-3 text-center">Reset Password</h3>
            <ForgotPasswordForm />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}