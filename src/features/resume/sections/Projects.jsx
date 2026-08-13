import { Form, Row, Col, Button, Card } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  link: "",
  techStack: "",
});

export default function Projects({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Projects</h5>
      {data.map((entry) => (
        <Card key={entry.id} className="p-3 mb-3">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
                  placeholder="Resume Builder"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="url"
                  value={entry.link}
                  onChange={(e) => updateEntry(entry.id, "link", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Tech Stack</Form.Label>
                <Form.Control
                  value={entry.techStack}
                  onChange={(e) => updateEntry(entry.id, "techStack", e.target.value)}
                  placeholder="React, Firebase, Bootstrap"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                  placeholder="What the project does and your role in it..."
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="outline-danger"
            size="sm"
            className="mt-3 align-self-start"
            onClick={() => removeEntry(entry.id)}
          >
            Remove
          </Button>
        </Card>
      ))}
      <Button variant="outline-primary" onClick={addEntry}>
        + Add Project
      </Button>
    </div>
  );
}