import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  platform: "",
  url: "",
});

export default function SocialLinks({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Social Links</h5>
      {data.map((entry) => (
        <Row key={entry.id} className="g-2 mb-2 align-items-center">
          <Col md={4}>
            <Form.Control
              value={entry.platform}
              onChange={(e) => updateEntry(entry.id, "platform", e.target.value)}
              placeholder="LinkedIn"
            />
          </Col>
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>🔗</InputGroup.Text>
              <Form.Control
                value={entry.url}
                onChange={(e) => updateEntry(entry.id, "url", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Button variant="outline-danger" size="sm" onClick={() => removeEntry(entry.id)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="outline-primary" onClick={addEntry}>
        + Add Link
      </Button>
    </div>
  );
}