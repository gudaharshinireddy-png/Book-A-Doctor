import { useEffect, useMemo, useState } from "react";
import {
  getDoctorAppointments,
  acceptAppointment,
  rejectAppointment,
} from "../services/appointmentService";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const { data } = await getDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await getDoctorAppointments();
        if (active) setAppointments(data);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load appointments");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleAccept = async (id) => {
    setProcessingId(id);
    setError("");
    setSuccess("");
    try {
      await acceptAppointment(id);
      setSuccess("Appointment approved successfully.");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve appointment.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this appointment request?")) return;

    setProcessingId(id);
    setError("");
    setSuccess("");
    try {
      await rejectAppointment(id);
      setSuccess("Appointment rejected successfully.");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject appointment.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusSummary = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      approved: appointments.filter((item) => item.status === "approved").length,
      rejected: appointments.filter((item) => item.status === "rejected").length,
    }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesStatus = activeFilter === "all" || item.status === activeFilter;
      const patientName = item.patientId?.name?.toLowerCase() || "";
      const patientEmail = item.patientId?.email?.toLowerCase() || "";
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query || patientName.includes(query) || patientEmail.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [appointments, activeFilter, search]);

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  return (
    <div className="page-container doctor-page">
      <div className="page-header">
        <h1>Appointment Requests</h1>
        <p>Review assigned consultations and manage appointment decisions.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="appointment-stats">
        <div className="appointment-stat-item">
          <strong>{statusSummary.total}</strong>
          <span>Total</span>
        </div>
        <div className="appointment-stat-item">
          <strong>{statusSummary.pending}</strong>
          <span>Pending</span>
        </div>
        <div className="appointment-stat-item">
          <strong>{statusSummary.approved}</strong>
          <span>Approved</span>
        </div>
        <div className="appointment-stat-item">
          <strong>{statusSummary.rejected}</strong>
          <span>Rejected</span>
        </div>
      </div>

      <div className="filter-bar doctor-filter-bar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by patient name or email..."
        />
      </div>

      <div className="appointment-filters">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            type="button"
            className={activeFilter === status ? "filter-btn active" : "filter-btn"}
            onClick={() => setActiveFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <h3>No appointments yet</h3>
          <p>New patient requests will appear here.</p>
        </div>
      ) : (
        <div className="appointment-list">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No matching appointments</h3>
              <p>Try changing your status filter or search query.</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
            <div className="appointment-card" key={apt._id}>
              <div className="appointment-header">
                <h3>{apt.patientId?.name || "Patient"}</h3>
                <StatusBadge status={apt.status} />
              </div>

              <p className="appointment-meta">
                {apt.patientId?.email} · {apt.patientId?.phone || "No phone"}
              </p>

              <div className="appointment-details">
                <span>📅 {formatDate(apt.appointmentDate)}</span>
                <span>🕐 {apt.appointmentTime}</span>
              </div>

              {apt.reason && <p className="appointment-reason">{apt.reason}</p>}

              <div className="appointment-actions">
                <button
                  type="button"
                  className="btn-outline-primary btn-sm"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  View details
                </button>
              </div>

              {apt.status === "pending" && (
                <div className="appointment-actions">
                  <button
                    type="button"
                    className="btn-book btn-sm"
                    disabled={processingId === apt._id}
                    onClick={() => handleAccept(apt._id)}
                  >
                    {processingId === apt._id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="btn-outline-danger btn-sm"
                    disabled={processingId === apt._id}
                    onClick={() => handleReject(apt._id)}
                  >
                    {processingId === apt._id ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
            ))
          )}
        </div>
      )}

      {selectedAppointment && (
        <div className="doctor-modal-backdrop" role="dialog" aria-modal="true">
          <div className="doctor-modal-card">
            <div className="doctor-modal-head">
              <h3>Appointment Details</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedAppointment(null)}
                aria-label="Close details"
              />
            </div>
            <div className="doctor-modal-body">
              <p>
                <strong>Patient:</strong> {selectedAppointment.patientId?.name || "Patient"}
              </p>
              <p>
                <strong>Email:</strong> {selectedAppointment.patientId?.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedAppointment.patientId?.phone || "—"}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}
              </p>
              <p>
                <strong>Time:</strong> {selectedAppointment.appointmentTime}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-capitalize">{selectedAppointment.status}</span>
              </p>
              <p>
                <strong>Reason:</strong> {selectedAppointment.reason || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
