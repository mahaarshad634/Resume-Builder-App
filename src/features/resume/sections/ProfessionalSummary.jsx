import { Form } from "react-bootstrap";

export default function ProfessionalSummary({ data, onChange }) {
  return (
    <div className="mb-4">
      <h5>Professional Summary</h5>
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={4}
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A brief 2-3 sentence overview of your experience and strengths..."
        />
      </Form.Group>
    </div>
  );
}