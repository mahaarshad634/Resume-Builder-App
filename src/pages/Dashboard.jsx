import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Alert, Navbar } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  getResumes,
  createResume,
  deleteResume,
  duplicateResume,
} from "../services/resumeService";
import ResumeCard from "../features/resume/ResumeCard";
import ConfirmModal from "../components/ConfirmModal";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getResumes(user.uid);
      setResumes(data);
    } catch (err) {
      setError("Could not load your resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadResumes();
  }, [user]);

  const handleCreate = async () => {
    try {
      const newId = await createResume(user.uid);
      navigate(`/resume/${newId}`);
    } catch (err) {
      setError("Could not create a new resume. Please try again.");
    }
  };

  const handleDuplicate = async (resumeId) => {
    try {
      await duplicateResume(user.uid, resumeId);
      loadResumes();
    } catch (err) {
      setError("Could not duplicate this resume. Please try again.");
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteResume(user.uid, deleteTargetId);
      setDeleteTargetId(null);
      loadResumes();
    } catch (err) {
      setError("Could not delete this resume. Please try again.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="light" className="px-3 mb-4">
        <Navbar.Brand>Resume Builder</Navbar.Brand>
        <div className="ms-auto">
          <span className="me-3 text-muted">{user?.email}</span>
          <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Navbar>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Resumes</h2>
          <Button variant="primary" onClick={handleCreate}>
            + New Resume
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : resumes.length === 0 ? (
          <Alert variant="info">
            You don't have any resumes yet. Click "New Resume" to create your first one.
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {resumes.map((resume) => (
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