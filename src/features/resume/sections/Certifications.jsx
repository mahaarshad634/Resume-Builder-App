import { Form, Row, Col, Button, Card } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  name: "",
  issuer: "",
  date: "",
});

export default function Certifications({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Certifications</h5>
      {data.map((entry) => (
        <Card key={entry.id} className="p-3 mb-3">
          <Row className="g-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Certification Name</Form.Label>
                <Form.Control
                  value={entry.name}
                  onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
                  placeholder="AWS Certified Developer"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Issuer</Form.Label>
                <Form.Control
                  value={entry.issuer}
                  onChange={(e) => updateEntry(entry.id, "issuer", e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="month"
                  value={entry.date}
                  onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
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
        + Add Certification
      </Button>
    </div>
  );
}