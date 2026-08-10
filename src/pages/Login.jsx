import { Container, Row, Col, Card } from "react-bootstrap";
import LoginForm from "../features/auth/LoginForm";

export default function Login() {
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4">
            <h3 className="mb-3 text-center">Log In</h3>
            <LoginForm />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}