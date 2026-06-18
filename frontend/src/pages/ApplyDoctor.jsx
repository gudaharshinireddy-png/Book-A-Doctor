import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyDoctor } from "../services/doctorService";
import { DAYS_OF_WEEK, SPECIALIZATIONS } from "../utils/constants";

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    fees: "",
    hospital: "",
    qualification: "",
    availableDays: [],
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await applyDoctor({
        specialization: formData.specialization,
        experience: Number(formData.experience),
        fees: Number(formData.fees),
        hospital: formData.hospital,
        qualification: formData.qualification,
        availableDays: formData.availableDays,
        availableTime: {
          start: formData.startTime,
          end: formData.endTime,
        },
      });

      setSuccess(
        "Application submitted! You will be notified once an admin reviews it."
      );
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Become a Doctor</h1>
        <p>Submit your credentials to join our healthcare network</p>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <label>
              Specialization
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Years of Experience
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Consultation Fee (₹)
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                min="0"
                required
              />
            </label>

            <label>
              Qualification
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD"
              />
            </label>
          </div>

          <label>
            Hospital / Clinic
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              placeholder="Where do you practice?"
            />
          </label>

          <fieldset className="days-fieldset">
            <legend>Available Days</legend>
            <div className="days-grid">
              {DAYS_OF_WEEK.map((day) => (
                <label key={day} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.availableDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-row">
            <label>
              Available From
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Available Until
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <button type="submit" className="btn-book" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyDoctor;
