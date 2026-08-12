import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Navbar, Form, InputGroup } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  getResumes,
  createResume,
  deleteResume,
  duplicateResume,
} from "../services/resumeService";
import ResumeCard from "../features/resume/ResumeCard";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getResumes(user.uid);
      setResumes(data);
    } catch (err) {
      setError("Could not load your resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadResumes();
  }, [user]);

  const handleCreate = async () => {
    setActionError("");
    try {
      const newId = await createResume(user.uid);
      navigate(`/resume/${newId}`);
    } catch (err) {
      setActionError("Could not create a new resume. Please try again.");
    }
  };

  const handleDuplicate = async (resumeId) => {
    setActionError("");
    try {
      await duplicateResume(user.uid, resumeId);
      loadResumes();
    } catch (err) {
      setActionError("Could not duplicate this resume. Please try again.");
    }
  };

  const handleDeleteConfirmed = async () => {
    setActionError("");
    try {
      await deleteResume(user.uid, deleteTargetId);
      setDeleteTargetId(null);
      loadResumes();
    } catch (err) {
      setActionError("Could not delete this resume. Please try again.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar bg="light" className="px-3 mb-4">
        <Navbar.Brand>Resume Builder</Navbar.Brand>
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-muted">{user?.email}</span>
          <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Navbar>

      <Container className="dashboard-page">
        <div className="page-header mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <h2>My Resumes</h2>
            <p className="mb-0 text-muted">Create, customize, and manage polished resumes from a modern dashboard.</p>
          </div>
          <Button variant="primary" onClick={handleCreate}>
            + New Resume
          </Button>
        </div>

        <div className="section-panel mb-4">
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        {actionError && <ErrorMessage message={actionError} />}

        {loading ? (
          <Loader message="Loading your resumes..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadResumes} />
        ) : resumes.length === 0 ? (
          <Alert variant="info">
            You don't have any resumes yet. Click "New Resume" to create your first one.
          </Alert>
        ) : filteredResumes.length === 0 ? (
          <Alert variant="secondary">No resumes match "{searchQuery}".</Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredResumes.map((resume) => (
              <Col key={resume.id}>
                <ResumeCard
                  resume={resume}
                  onDuplicate={handleDuplicate}
                  onDelete={(id) => setDeleteTargetId(id)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <ConfirmModal
        show={!!deleteTargetId}
        title="Delete Resume"
        body="Are you sure you want to delete this resume? This cannot be undone."
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}