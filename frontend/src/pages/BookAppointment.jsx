import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { bookAppointment } from "../services/appointmentService";
import { getDoctors } from "../services/doctorService";
import LoadingSpinner from "../components/LoadingSpinner";

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loadingDoctor, setLoadingDoctor] = useState(!location.state?.doctor);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  useEffect(() => {
    if (doctor) return;

    let active = true;
    (async () => {
      try {
        const { data } = await getDoctors();
        const found = data.find((item) => item._id === doctorId);
        if (active) setDoctor(found || null);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load doctor details");
        }
      } finally {
        if (active) setLoadingDoctor(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [doctor, doctorId]);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.appointmentDate || !formData.appointmentTime) {
      setError("Please select appointment date and time.");
      return false;
    }

    if (formData.appointmentDate < minDate) {
      setError("Appointment date cannot be in the past.");
      return false;
    }

    if (formData.reason.trim().length < 10) {
      setError("Please provide a brief reason (at least 10 characters).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError("");
      await bookAppointment({
        doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason.trim(),
      });
      setSuccess("Appointment booked successfully. Awaiting doctor approval.");
      setTimeout(() => navigate("/appointments"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (!doctor) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Doctor not available</h3>
          <p>The selected doctor profile is not available right now.</p>
          <Link to="/doctors" className="btn-book">
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to={`/doctors/${doctorId}`} state={{ doctor }} className="back-link">
        ← Back to Doctor Profile
      </Link>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="doctor-avatar large">
            {doctor.userId?.name?.charAt(0) || "D"}
          </div>
          <h1>Dr. {doctor.userId?.name}</h1>
          <p className="doctor-spec">{doctor.specialization}</p>
          <ul className="detail-list">
            <li>
              <strong>Experience:</strong> {doctor.experience} years
            </li>
            <li>
              <strong>Consultation Fee:</strong> ₹{doctor.fees}
            </li>
            {doctor.qualification && (
              <li>
                <strong>Qualification:</strong> {doctor.qualification}
              </li>
            )}
            {doctor.availableDays?.length > 0 && (
              <li>
                <strong>Availability:</strong> {doctor.availableDays.join(", ")}
              </li>
            )}
          </ul>
        </div>

        <div className="detail-card">
          <h2>Book Appointment</h2>
          <p className="detail-note">
            Please choose your preferred date/time and include medical details
            to help the doctor prepare.
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              Date
              <input
                type="date"
                name="appointmentDate"
                min={minDate}
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Time
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Reason for Visit
              <textarea
                rows={4}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe symptoms, concerns, or reason for consultation..."
                required
              />
            </label>
            <button className="btn-book w-100" type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
