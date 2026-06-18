import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getDoctors } from "../services/doctorService";
import LoadingSpinner from "../components/LoadingSpinner";
import { SPECIALIZATIONS } from "../utils/constants";

const Doctors = () => {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialization, setSpecialization] = useState(
    searchParams.get("specialization") || ""
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.userId?.name?.toLowerCase() || "";
    const spec = doctor.specialization?.toLowerCase() || "";
    const query = search.toLowerCase();

    const matchesSearch =
      !query || name.includes(query) || spec.includes(query);

    const matchesSpec =
      !specialization || doctor.specialization === specialization;

    return matchesSearch && matchesSpec;
  });

  if (loading) {
    return <LoadingSpinner message="Loading doctors..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find a Doctor</h1>
        <p>Browse verified specialists and book your appointment</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <h3>No doctors found</h3>
          <p>Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <div className="doctor-avatar">
                {doctor.userId?.name?.charAt(0) || "D"}
              </div>
              <div className="doctor-info">
                <h3>Dr. {doctor.userId?.name}</h3>
                <p className="doctor-spec">{doctor.specialization}</p>
                <p className="doctor-meta">
                  {doctor.experience} yrs experience · ₹{doctor.fees} fee
                </p>
                {doctor.hospital && (
                  <p className="doctor-hospital">{doctor.hospital}</p>
                )}
                <Link
                  to={`/doctors/${doctor._id}`}
                  state={{ doctor }}
                  className="btn-book"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
