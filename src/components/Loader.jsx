import { Spinner } from "react-bootstrap";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="text-center mt-5">
      <Spinner animation="border" role="status" />
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
}