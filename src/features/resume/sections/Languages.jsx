import { Form, Row, Col, Button, Card } from "react-bootstrap";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  name: "",
  proficiency: "Intermediate",
});

export default function Languages({ data, onChange }) {
  const addEntry = () => onChange([...data, blankEntry()]);

  const updateEntry = (id, field, value) => {
    onChange(data.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const removeEntry = (id) => onChange(data.filter((entry) => entry.id !== id));

  return (
    <div className="mb-4">
      <h5>Languages</h5>
      {data.map((entry) => (
        <Row key={entry.id} className="g-2 mb-2 align-items-center">
          <Col md={5}>
            <Form.Control
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
              placeholder="Spanish"
            />
          </Col>
          <Col md={5}>
            <Form.Select
              value={entry.proficiency}
              onChange={(e) => updateEntry(entry.id, "proficiency", e.target.value)}
            >
              <option>Basic</option>
              <option>Intermediate</option>
              <option>Fluent</option>
              <option>Native</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="outline-danger" size="sm" onClick={() => removeEntry(entry.id)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="outline-primary" onClick={addEntry}>
        + Add Language
      </Button>
    </div>
  );
}