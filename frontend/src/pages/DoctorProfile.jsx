import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import { DAYS_OF_WEEK, SPECIALIZATIONS } from "../utils/constants";
import {
  getDoctors,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from "../services/doctorService";
import { getProfile, updateProfile } from "../services/authService";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  fees: "",
  qualification: "",
  hospital: "",
  availableDays: [],
  startTime: "",
  endTime: "",
};

const DoctorProfile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [userRes, doctorRes] = await Promise.allSettled([
          getProfile(),
          getMyDoctorProfile(),
        ]);

        if (!active) return;

        const userData =
          userRes.status === "fulfilled"
            ? userRes.value.data
            : {
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
              };

        let doctorData = null;
        if (doctorRes.status === "fulfilled") {
          doctorData = doctorRes.value.data;
        } else {
          try {
            const { data } = await getDoctors();
            doctorData = data.find((item) => item.userId?._id === user?._id) || null;
          } catch {
            doctorData = null;
          }
        }

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          specialization: doctorData?.specialization || "",
          experience: doctorData?.experience ?? "",
          fees: doctorData?.fees ?? "",
          qualification: doctorData?.qualification || "",
          hospital: doctorData?.hospital || "",
          availableDays: doctorData?.availableDays || [],
          startTime: doctorData?.availableTime?.start || "",
          endTime: doctorData?.availableTime?.end || "",
        });
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load doctor profile.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user?._id, user?.email, user?.name, user?.phone]);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (formData.phone && !/^[+]?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }
    if (!formData.specialization) errors.specialization = "Specialization is required.";
    if (formData.experience === "" || Number(formData.experience) < 0) {
      errors.experience = "Experience must be 0 or more.";
    }
    if (formData.fees === "" || Number(formData.fees) < 0) {
      errors.fees = "Consultation fee must be 0 or more.";
    }
    if (!formData.qualification.trim()) errors.qualification = "Qualification is required.";
    if (formData.availableDays.length === 0) {
      errors.availableDays = "Select at least one available day.";
    }
    if (!formData.startTime || !formData.endTime) {
      errors.availableTime = "Start and end time are required.";
    } else if (formData.startTime >= formData.endTime) {
      errors.availableTime = "End time must be later than start time.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((item) => item !== day)
        : [...prev.availableDays, day],
    }));
    setFieldErrors((prev) => ({ ...prev, availableDays: "", availableTime: "" }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "", availableTime: "" }));
    setError("");
    setSuccess("");
  };

  const sortedDays = useMemo(
    () =>
      [...formData.availableDays].sort(
        (a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)
      ),
    [formData.availableDays]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const userPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      const doctorPayload = {
        specialization: formData.specialization,
        experience: Number(formData.experience),
        fees: Number(formData.fees),
        qualification: formData.qualification.trim(),
        hospital: formData.hospital.trim(),
        availableDays: sortedDays,
        availableTime: {
          start: formData.startTime,
          end: formData.endTime,
        },
      };

      const [userRes] = await Promise.all([
        updateProfile(userPayload),
        updateMyDoctorProfile(doctorPayload),
      ]);

      const token = localStorage.getItem("token");
      if (token) {
        login(
          {
            _id: userRes.data._id || user?._id,
            name: userRes.data.name,
            email: userRes.data.email,
            role: userRes.data.role || user?.role,
            phone: userRes.data.phone,
          },
          token
        );
      }

      setSuccess("Doctor profile updated successfully.");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Doctor profile update endpoint is not available on the backend.");
      } else {
        setError(err.response?.data?.message || "Failed to update doctor profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctor profile..." />;
  }

  return (
    <div className="page-container doctor-page">
      <div className="page-header">
        <h1>Doctor Profile</h1>
        <p>Manage your personal information, professional details, and availability.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-card doctor-profile-card">
        <form className="application-form doctor-profile-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>
              Full Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldErrors.name ? "field-error" : ""}
              />
              {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldErrors.email ? "field-error" : ""}
              />
              {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
            </label>
          </div>

          <div className="form-row">
            <label>
              Phone
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={fieldErrors.phone ? "field-error" : ""}
              />
              {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
            </label>
            <label>
              Specialization
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={fieldErrors.specialization ? "field-error" : ""}
              >
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {fieldErrors.specialization && (
                <span className="field-error-text">{fieldErrors.specialization}</span>
              )}
            </label>
          </div>

          <div className="form-row">
            <label>
              Experience (years)
              <input
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                className={fieldErrors.experience ? "field-error" : ""}
              />
              {fieldErrors.experience && (
                <span className="field-error-text">{fieldErrors.experience}</span>
              )}
            </label>
            <label>
              Consultation Fee (₹)
              <input
                name="fees"
                type="number"
                min="0"
                value={formData.fees}
                onChange={handleChange}
                className={fieldErrors.fees ? "field-error" : ""}
              />
              {fieldErrors.fees && <span className="field-error-text">{fieldErrors.fees}</span>}
            </label>
          </div>

          <div className="form-row">
            <label>
              Qualification
              <input
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={fieldErrors.qualification ? "field-error" : ""}
              />
              {fieldErrors.qualification && (
                <span className="field-error-text">{fieldErrors.qualification}</span>
              )}
            </label>
            <label>
              Hospital / Clinic
              <input name="hospital" value={formData.hospital} onChange={handleChange} />
            </label>
          </div>

          <fieldset className="days-fieldset">
            <legend>Availability Days</legend>
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
            {fieldErrors.availableDays && (
              <span className="field-error-text">{fieldErrors.availableDays}</span>
            )}
          </fieldset>

          <div className="form-row">
            <label>
              Available From
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </label>
            <label>
              Available Until
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </label>
          </div>
          {fieldErrors.availableTime && (
            <span className="field-error-text">{fieldErrors.availableTime}</span>
          )}

          <button className="btn-book" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
