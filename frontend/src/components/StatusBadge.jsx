const STATUS_STYLES = {
  pending: "bg-warning text-dark",
  approved: "bg-success",
  completed: "bg-info",
  cancelled: "bg-secondary",
  rejected: "bg-danger",
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_STYLES[status] || "bg-secondary"}`}>
    {status}
  </span>
);

export default StatusBadge;
