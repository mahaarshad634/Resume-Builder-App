import { Form, Row, Col, Button, Card } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
});

export default function Education({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Education</h5>
      {data.map((entry) => (
        <Card key={entry.id} className="p-3 mb-3">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Institution</Form.Label>
                <Form.Control
                  value={entry.institution}
                  onChange={(e) => updateEntry(entry.id, "institution", e.target.value)}
                  placeholder="University of..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Degree</Form.Label>
                <Form.Control
                  value={entry.degree}
                  onChange={(e) => updateEntry(entry.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Field of Study</Form.Label>
                <Form.Control
                  value={entry.field}
                  onChange={(e) => updateEntry(entry.id, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="month"
                  value={entry.startDate}
                  onChange={(e) => updateEntry(entry.id, "startDate", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="month"
                  value={entry.endDate}
                  onChange={(e) => updateEntry(entry.id, "endDate", e.target.value)}
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
                  placeholder="Relevant coursework, honors, activities..."
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
        + Add Education
      </Button>
    </div>
  );
}
