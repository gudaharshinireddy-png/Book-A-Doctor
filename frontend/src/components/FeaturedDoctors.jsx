import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/doctorService";

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors()
      .then(({ data }) => setDoctors(data.slice(0, 3)))
      .catch(() => setDoctors([]));
  }, []);

  return (
    <section className="featured-doctors">
      <div className="section-header">
        <h2>Featured Doctors</h2>
        <p>Top specialists available for booking</p>
      </div>

      {doctors.length === 0 ? (
        <div className="section-empty">
          <p>Doctors will appear here once approved by admin.</p>
          <Link to="/doctors" className="btn-book">
            Browse Doctors
          </Link>
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <div className="doctor-card" key={doctor._id}>
              <div className="doctor-avatar featured">
                {doctor.userId?.name?.charAt(0) || "D"}
              </div>
              <div className="doctor-info">
                <h3>Dr. {doctor.userId?.name}</h3>
                <p>{doctor.specialization}</p>
                <span>
                  {doctor.experience} yrs experience · ₹{doctor.fees}
                </span>
                <Link
                  to={`/doctors/${doctor._id}`}
                  state={{ doctor }}
                  className="btn-book"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedDoctors;
