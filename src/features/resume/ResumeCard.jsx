import { Card, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ResumeCard({ resume, onDuplicate, onDelete }) {
  const navigate = useNavigate();

  const formattedDate = resume.updatedAt?.toDate
    ? resume.updatedAt.toDate().toLocaleDateString()
    : "Just now";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{resume.title}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          Last updated: {formattedDate}
        </Card.Subtitle>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/resume/${resume.id}`)}
          >
            Edit
          </Button>

          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onDuplicate(resume.id)}>
                Duplicate
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={() => onDelete(resume.id)}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Body>
    </Card>
  );
}