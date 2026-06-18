import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProfile, updateProfile } from "../services/authService";

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await getProfile();
        if (!active) return;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
        });
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to fetch profile details.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (formData.phone && !/^[+]?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = "Password should be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      setError("");
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const { data } = await updateProfile(payload);
      const token = localStorage.getItem("token");
      if (token) {
        login(
          {
            _id: data._id || user?._id,
            name: data.name,
            email: data.email,
            role: data.role || user?.role,
            phone: data.phone,
          },
          token
        );
      }

      setFormData((prev) => ({ ...prev, password: "" }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Profile update endpoint is not available on the backend.");
      } else {
        setError(err.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal details and keep your account updated.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-card profile-card">
        <form className="profile-form" onSubmit={handleSubmit} noValidate>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldErrors.name ? "field-error" : ""}
            />
            {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldErrors.email ? "field-error" : ""}
            />
            {fieldErrors.email && (
              <span className="field-error-text">{fieldErrors.email}</span>
            )}
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={fieldErrors.phone ? "field-error" : ""}
            />
            {fieldErrors.phone && (
              <span className="field-error-text">{fieldErrors.phone}</span>
            )}
          </label>

          <label>
            New Password (optional)
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className={fieldErrors.password ? "field-error" : ""}
            />
            {fieldErrors.password && (
              <span className="field-error-text">{fieldErrors.password}</span>
            )}
          </label>

          <button className="btn-book profile-save-btn" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
