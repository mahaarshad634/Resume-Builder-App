import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ResumeCard({ resume }) {
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

        <div className="resume-card-actions mt-auto">
          <Button
            variant="primary"
            size="sm"
            className="w-100"
            onClick={() => navigate(`/resume/${resume.id}`)}
          >
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}