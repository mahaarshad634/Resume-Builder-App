import { Container, Row, Col, Card } from "react-bootstrap";
import SignupForm from "../features/auth/SignupForm";

export default function Signup() {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4">
            <h3 className="mb-3 text-center">Create Account</h3>
            <SignupForm />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}