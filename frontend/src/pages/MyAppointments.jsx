import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMyAppointments,
  cancelAppointment,
  rescheduleAppointment,
} from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { APPOINTMENT_STATUS } from "../utils/constants";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    appointmentDate: "",
    appointmentTime: "",
  });

  const fetchAppointments = async () => {
    try {
      const [appointmentsRes, doctorsRes] = await Promise.all([
        getMyAppointments(),
        getDoctors(),
      ]);

      setAppointments(appointmentsRes.data);

      const map = {};
      doctorsRes.data.forEach((doctor) => {
        map[doctor._id] = doctor;
      });
      setDoctorMap(map);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (apt) => {
    const doctorId = apt.doctorId?._id || apt.doctorId;
    const doctor = doctorMap[doctorId] || apt.doctorId;
    return doctor?.userId?.name || "Doctor";
  };

  const getDoctorSpec = (apt) => {
    const doctorId = apt.doctorId?._id || apt.doctorId;
    const doctor = doctorMap[doctorId] || apt.doctorId;
    return doctor?.specialization || "Specialist";
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          getMyAppointments(),
          getDoctors(),
        ]);

        if (!active) return;
        setAppointments(appointmentsRes.data);

        const map = {};
        doctorsRes.data.forEach((doctor) => {
          map[doctor._id] = doctor;
        });
        setDoctorMap(map);
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

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();

    try {
      await rescheduleAppointment(rescheduleId, rescheduleData);
      setRescheduleId(null);
      setRescheduleData({ appointmentDate: "", appointmentTime: "" });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reschedule");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusSummary = {
    [APPOINTMENT_STATUS.PENDING]:
      appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.PENDING).length,
    [APPOINTMENT_STATUS.APPROVED]:
      appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.APPROVED).length,
    [APPOINTMENT_STATUS.REJECTED]:
      appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.REJECTED).length,
    [APPOINTMENT_STATUS.CANCELLED]:
      appointments.filter((apt) => apt.status === APPOINTMENT_STATUS.CANCELLED).length,
  };

  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === activeFilter);

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Appointments</h1>
        <p>View and manage your scheduled visits</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="appointment-stats">
        <div className="appointment-stat-item">
          <strong>{appointments.length}</strong>
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

      <div className="appointment-filters">
        {["all", "pending", "approved", "rejected", "cancelled"].map((status) => (
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
          <p>Book your first appointment with a specialist.</p>
          <Link to="/doctors" className="btn-book">
            Find Doctors
          </Link>
        </div>
      ) : (
        <>
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No appointments in this status</h3>
              <p>Try selecting another status filter.</p>
            </div>
          ) : (
            <div className="appointment-list">
              {filteredAppointments.map((apt) => (
                <div className="appointment-card" key={apt._id}>
                  <div className="appointment-header">
                    <h3>Dr. {getDoctorName(apt)}</h3>
                    <StatusBadge status={apt.status} />
                  </div>

                  <p className="doctor-spec">{getDoctorSpec(apt)}</p>

                  <div className="appointment-details">
                    <span>📅 {formatDate(apt.appointmentDate)}</span>
                    <span>🕐 {apt.appointmentTime}</span>
                  </div>

                  {apt.reason && <p className="appointment-reason">{apt.reason}</p>}

                  {(apt.status === "pending" || apt.status === "approved") && (
                    <div className="appointment-actions">
                      <button
                        type="button"
                        className="btn-outline-danger btn-sm"
                        onClick={() => handleCancel(apt._id)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-outline-primary btn-sm"
                        onClick={() => setRescheduleId(apt._id)}
                      >
                        Reschedule
                      </button>
                    </div>
                  )}

                  {rescheduleId === apt._id && (
                    <form onSubmit={handleReschedule} className="reschedule-form">
                      <input
                        type="date"
                        value={rescheduleData.appointmentDate}
                        onChange={(e) =>
                          setRescheduleData({
                            ...rescheduleData,
                            appointmentDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                      <input
                        type="time"
                        value={rescheduleData.appointmentTime}
                        onChange={(e) =>
                          setRescheduleData({
                            ...rescheduleData,
                            appointmentTime: e.target.value,
                          })
                        }
                        required
                      />
                      <button type="submit" className="btn-book btn-sm">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn-outline-secondary btn-sm"
                        onClick={() => setRescheduleId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyAppointments;
