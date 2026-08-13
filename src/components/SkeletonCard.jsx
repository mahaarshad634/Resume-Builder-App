export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-line w-60" style={{ height: "18px" }} />
      <div className="skeleton skeleton-line w-40" />
      <div className="d-flex justify-content-between mt-4">
        <div className="skeleton" style={{ width: "60px", height: "28px" }} />
        <div className="skeleton" style={{ width: "36px", height: "28px" }} />
      </div>
    </div>
  );
}