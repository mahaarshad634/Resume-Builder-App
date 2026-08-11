import { Form, Button, Badge, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function Skills({ data, onChange }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    if (!input.trim()) return;
    onChange([...data, { id: crypto.randomUUID(), name: input.trim() }]);
    setInput("");
  };

  const removeSkill = (id) => onChange(data.filter((skill) => skill.id !== id));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="mb-4">
      <h5>Skills</h5>
      <Row className="g-2 mb-3">
        <Col xs={9}>
          <Form.Control
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. JavaScript, Figma, Project Management"
          />
        </Col>
        <Col xs={3}>
          <Button variant="outline-primary" className="w-100" onClick={addSkill}>
            Add
          </Button>
        </Col>
      </Row>

      <div className="d-flex flex-wrap gap-2">
        {data.map((skill) => (
          <Badge key={skill.id} bg="secondary" className="p-2">
            {skill.name}{" "}
            <span
              role="button"
              onClick={() => removeSkill(skill.id)}
              className="ms-1"
              style={{ cursor: "pointer" }}
            >
              ×
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}