import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button,  Navbar, Form, Dropdown } from "react-bootstrap";
import { useEffect,  useState } from "react";

import { MoreVertical, Copy, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ResumeForm from "../features/resume/ResumeForm";
import ResumePreview from "../features/resume/ResumePreview";
import { useResume } from "../hooks/useResume";
import { useDebounce } from "../hooks/useDebounce";
import { templateOptions } from "../features/resume/templates/templateRegistry";
import { duplicateResume, deleteResume } from "../services/resumeService";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import ThemeToggle from "../components/ThemeToggle";
import ColorPalette from "../components/ColorPalette";
import ConfirmModal from "../components/ConfirmModal";
import { exportResumeToPdf } from "../utils/exportResumePdf";

export default function ResumeEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { resumeData, loading, saving, error, saveError, isDirty, updateSection, save } =
    useResume(user?.uid, id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");



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
}, [debouncedResumeData]); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally excludes save/isDirty/loading to avoid an endless auto-save loop

  useEffect(() => {
    // Apply saved palette colors — brand colors only.
    // bg/surface/border are intentionally NOT set here: those belong to
    // light/dark mode (controlled by ThemeContext via data-theme on <html>),
    // not the color palette. Setting them here as inline styles would
    // permanently override dark mode's CSS variables on this page.
    if (resumeData?.themeColors) {
      const c = resumeData.themeColors;
      const root = document.documentElement;
      root.style.setProperty("--color-primary", c.primary || "#235a7e");
      root.style.setProperty("--color-primary-hover", c.primaryHover || "#1b4a65");
      root.style.setProperty("--color-accent", c.accent || "#f0a845");
    }
  }, [resumeData?.themeColors]);

  const handleDuplicate = async () => {
    setActionError("");
    setActionLoading(true);
    try {
      const newId = await duplicateResume(user.uid, id);
      navigate(`/resume/${newId}`);
    } catch (err) {
      console.error("Failed to duplicate resume:", err);
      setActionError("Could not duplicate this resume. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    setActionError("");
    setActionLoading(true);
    try {
      await deleteResume(user.uid, id);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete resume:", err);
      setActionError("Could not delete this resume. Please try again.");
      setActionLoading(false);
    }
  };

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

  if (!resumeData && !loading) {
    return (
      <Container className="mt-5">
        <ErrorMessage message="No resume loaded. Please select or create a resume from the dashboard." />
        <div className="mt-3">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="resume-editor-page">
      <Navbar bg="light" className="editor-toolbar px-4 mb-4 flex-wrap gap-2">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/dashboard")}>← Back</Button>

        <Form.Control
          type="text"
          value={resumeData?.title || ""}
          onChange={(e) => updateSection("title", e.target.value)}
          className="mx-3"
          style={{ maxWidth: "300px" }}
          placeholder="Resume title"
        />

        <Form.Select
          value={resumeData?.templateId || templateOptions[0]?.id}
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
          <ColorPalette
            currentColors={resumeData.themeColors}
            onSelect={(colors) => updateSection("themeColors", colors)}
          />
          <ThemeToggle />

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <MoreVertical size={15} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={handleDuplicate} disabled={actionLoading}>
                <Copy size={14} className="me-2" />
                Duplicate
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={actionLoading}
              >
                <Trash2 size={14} className="me-2" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {saveError && <span className="text-danger">{saveError}</span>}
          {actionError && <span className="text-danger">{actionError}</span>}
          <Button variant="outline-primary" size="sm" onClick={() => exportResumeToPdf(resumeData)}>
            Download PDF
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={saving || !isDirty}>
            {saving ? "Saving..." : isDirty ? "Save*" : "Saved"}
          </Button>
        </div>
      </Navbar>

      <Container fluid className="animate-in">
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
              <ResumePreview resumeData={resumeData}  />
            </div>
          </Col>
        </Row>
      </Container>

      <ConfirmModal
        show={showDeleteConfirm}
        title="Delete Resume"
        body="Are you sure you want to delete this resume? This cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}