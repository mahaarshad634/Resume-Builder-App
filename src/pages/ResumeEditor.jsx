import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Navbar, Form } from "react-bootstrap";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "../context/AuthContext";
import ResumeForm from "../features/resume/ResumeForm";
import ResumePreview from "../features/resume/ResumePreview";
import { useResume } from "../hooks/useResume";
import { useDebounce } from "../hooks/useDebounce";
import { templateOptions } from "../features/resume/templates/templateRegistry";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import ThemeToggle from "../components/ThemeToggle";

export default function ResumeEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { resumeData, loading, saving, error, saveError, isDirty, updateSection, save } =
    useResume(user.uid, id);

  const previewRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: resumeData?.title || "Resume",
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const debouncedResumeData = useDebounce(resumeData, 1500);

  useEffect(() => {
    if (isDirty && debouncedResumeData && !loading) {
      save();
    }
  }, [debouncedResumeData]);

  if (loading) {
    return <Loader message="Loading your resume..." />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <ErrorMessage message={error} />
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="resume-editor-page">
       <ThemeToggle />
      <Navbar bg="light" className="editor-toolbar px-4 mb-4 flex-wrap gap-2">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/dashboard")}>← Back</Button>

        <Form.Control
          type="text"
          value={resumeData.title}
          onChange={(e) => updateSection("title", e.target.value)}
          className="mx-3"
          style={{ maxWidth: "300px" }}
          placeholder="Resume title"
        />

        <Form.Select
          value={resumeData.templateId}
          onChange={(e) => updateSection("templateId", e.target.value)}
          style={{ maxWidth: "180px" }}
        >
          {templateOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </Form.Select>

        <div className="ms-auto d-flex align-items-center gap-2">
          {saveError && <span className="text-danger">{saveError}</span>}
          <Button variant="outline-primary" size="sm" onClick={handlePrint}>
            Download PDF
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={saving || !isDirty}>
            {saving ? "Saving..." : isDirty ? "Save*" : "Saved"}
          </Button>
        </div>
      </Navbar>

      <Container fluid>
        <div className="page-header mb-4">
          <div>
            <h2>Resume Editor</h2>
            <p className="mb-0 text-muted">Edit content, choose a template, and preview your resume in real time.</p>
          </div>
        </div>

        <Row className="g-4">
          <Col xs={12} md={6}>
            <div className="section-panel">
              <h5 className="mb-4">Resume Details</h5>
              <ResumeForm resumeData={resumeData} updateSection={updateSection} />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="resume-preview-shell">
              <div className="preview-title">Live Preview</div>
              <ResumePreview resumeData={resumeData} ref={previewRef} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}