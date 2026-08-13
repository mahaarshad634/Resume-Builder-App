import { Form, Row, Col, Button, Card } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export default function Experience({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Experience</h5>
      {data.map((entry) => (
        <Card key={entry.id} className="p-3 mb-3">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company</Form.Label>
                <Form.Control
                  value={entry.company}
                  onChange={(e) => updateEntry(entry.id, "company", e.target.value)}
                  placeholder="Acme Corp"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  value={entry.role}
                  onChange={(e) => updateEntry(entry.id, "role", e.target.value)}
                  placeholder="Software Engineer"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={entry.startDate}
                  onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={entry.endDate}
                  disabled={entry.current}
                  onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Form.Check
                type="checkbox"
                label="Currently working here"
                checked={entry.current}
                onChange={(e) => updateEntry(entry.id, "current", e.target.checked)}
              />
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                  placeholder="Key responsibilities and achievements..."
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
        + Add Experience
      </Button>
    </div>
  );
}