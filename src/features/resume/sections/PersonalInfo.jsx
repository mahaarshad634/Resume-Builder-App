import { Form, Row, Col } from "react-bootstrap";

export default function PersonalInfo({ data, onChange }) {
  const handleChange = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-4">
      <h5>Personal Information</h5>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              name="jobTitle"
              value={data.jobTitle}
              onChange={handleChange}
              placeholder="Frontend Developer"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="+1 555 123 4567"
              autoComplete="tel"
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}