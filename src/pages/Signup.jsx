import { Container, Row, Col, Card } from "react-bootstrap";
import SignupForm from "../features/auth/SignupForm";
import ResumePreview from "../features/resume/ResumePreview";

export default function Signup() {
  return (
    <Container>
     <Row>
  <Col md={6} className="mb-4">
    <h5>Edit Resume</h5>
    <ResumeForm resumeData={resumeData} updateSection={updateSection} />
  </Col>
  <Col md={6} className="mb-4">
    <h5>Live Preview</h5>
    <ResumePreview resumeData={resumeData} />
  </Col>
</Row>
    </Container>
  );
}