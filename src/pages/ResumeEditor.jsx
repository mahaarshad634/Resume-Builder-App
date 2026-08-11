import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Alert, Navbar, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import ResumeForm from "../features/resume/ResumeForm";
import ResumePreview from "../features/resume/ResumePreview";
import { useResume } from "../hooks/useResume";
import { templateOptions } from "../features/resume/templates/templateRegistry";

export default function ResumeEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { resumeData, loading, saving, error, saveError, updateSection, save } =
    useResume(user.uid, id);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <>
     <Navbar bg="light" className="px-3 mb-3">
  <Button variant="outline-secondary" size="sm" onClick={() => navigate("/dashboard")}>
    ← Back
  </Button>

  <Form.Control
    type="text"
    value={resumeData.title}
    onChange={(e) => updateSection("title", e.target.value)}
    className="mx-3"
    style={{ maxWidth: "300px" }}
  />

  <Form.Select
    value={resumeData.templateId}
    onChange={(e) => updateSection("templateId", e.target.value)}
    style={{ maxWidth: "160px" }}
  >
    {templateOptions.map((opt) => (
      <option key={opt.id} value={opt.id}>
        {opt.label}
      </option>
    ))}
  </Form.Select>

  <div className="ms-auto">
    {saveError && <span className="text-danger me-3">{saveError}</span>}
    <Button variant="primary" size="sm" onClick={save} disabled={saving}>
      {saving ? "Saving..." : "Save"}
    </Button>
  </div>
</Navbar>

      <Container fluid>
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
    </>
  );
}