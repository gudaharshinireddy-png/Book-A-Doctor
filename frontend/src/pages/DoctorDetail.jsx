import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { getDoctors } from "../services/doctorService";
import LoadingSpinner from "../components/LoadingSpinner";

const DoctorDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(location.state?.doctor || null);
  const [loading, setLoading] = useState(!location.state?.doctor);
  const [error, setError] = useState("");

  useEffect(() => {
    if (doctor) return;

    const fetchDoctor = async () => {
      try {
        const { data } = await getDoctors();
        const found = data.find((d) => d._id === id);
        setDoctor(found || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, doctor]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor._id}`, { state: { doctor } });
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctor profile..." />;
  }

  if (!doctor) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Doctor not found</h3>
          <Link to="/doctors" className="btn-book">
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/doctors" className="back-link">
        ← Back to Doctors
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
            {doctor.hospital && (
              <li>
                <strong>Hospital:</strong> {doctor.hospital}
              </li>
            )}
            {doctor.availableDays?.length > 0 && (
              <li>
                <strong>Available Days:</strong>{" "}
                {doctor.availableDays.join(", ")}
              </li>
            )}
            {doctor.availableTime && (
              <li>
                <strong>Available Time:</strong>{" "}
                {doctor.availableTime.start} – {doctor.availableTime.end}
              </li>
            )}
          </ul>
        </div>

        <div className="detail-card">
          <h2>Book Appointment</h2>
          <p className="detail-note">
            Select your preferred slot and share your reason for visit on the
            booking page.
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          <button
            type="button"
            className="btn-book w-100"
            onClick={handleBookAppointment}
          >
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
