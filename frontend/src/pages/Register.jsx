import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { FaUserInjured, FaUserMd, FaUserShield } from "react-icons/fa";
import { registerUser } from "../services/authService";
import api from "../services/api";
import { SPECIALIZATIONS, ROLES } from "../utils/constants";
import AuthBranding from "../components/auth/AuthBranding";
import "../styles/AuthPages.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  specialization: "",
  experience: "",
  qualification: "",
  fees: "",
};

const validateRegister = (role, values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (values.phone && !/^[+]?[\d\s-]{10,15}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (role === ROLES.DOCTOR) {
    if (!values.specialization) {
      errors.specialization = "Specialization is required";
    }
    if (!values.experience) {
      errors.experience = "Experience is required";
    } else if (Number(values.experience) < 0) {
      errors.experience = "Experience cannot be negative";
    }
    if (!values.qualification.trim()) {
      errors.qualification = "Qualification is required";
    }
    if (!values.fees) {
      errors.fees = "Consultation fee is required";
    } else if (Number(values.fees) < 0) {
      errors.fees = "Fee cannot be negative";
    }
  }

  return errors;
};

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(ROLES.PATIENT);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFieldErrors({});
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRegister(role, formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const registerPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: role === ROLES.DOCTOR ? ROLES.PATIENT : role,
      };

      const { data } = await registerUser(registerPayload);

      if (role === ROLES.DOCTOR) {
        const doctorToken = data?.token || data?.data?.token;

        if (!doctorToken) {
          throw new Error("Doctor token missing after registration");
        }

        const existingToken = localStorage.getItem("token");
        localStorage.setItem("token", doctorToken);

        try {
          await api.post("/doctors/apply", {
            specialization: formData.specialization,
            experience: Number(formData.experience),
            fees: Number(formData.fees),
            qualification: formData.qualification.trim(),
          });
        } finally {
          if (existingToken) {
            localStorage.setItem("token", existingToken);
          } else {
            localStorage.removeItem("token");
          }
        }
      }

      const message =
        role === ROLES.DOCTOR
          ? "Registration successful! Your doctor application is pending admin approval."
          : "Registration successful! Please sign in to continue.";

      navigate("/login", { state: { message } });
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const roles = [
    { id: ROLES.PATIENT, label: "Patient", icon: <FaUserInjured /> },
    { id: ROLES.DOCTOR, label: "Doctor", icon: <FaUserMd /> },
    {
      id: ROLES.ADMIN,
      label: "Admin",
      icon: <FaUserShield />,
    },
  ];

  const renderField = (
    name,
    label,
    type = "text",
    placeholder,
    icon,
    options = {}
  ) => (
    <div className={`auth-field ${fieldErrors[name] ? "input-error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {icon ? (
        <div className="auth-input-wrap">
          {icon}
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            {...options}
          />
        </div>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          {...options}
        />
      )}
      {fieldErrors[name] && (
        <span className="auth-field-error">
          <FiAlertCircle size={13} />
          {fieldErrors[name]}
        </span>
      )}
    </div>
  );

  return (
    <div className="auth-shell">
      <AuthBranding variant="register" />

      <div className="auth-form-panel">
        <div className="auth-glass-card">
          <div className="auth-card-header">
            <h2>Create your account</h2>
            <p>Choose your role and complete registration</p>
          </div>

          <div className="auth-role-tabs">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`auth-role-tab ${role === r.id ? "active" : ""}`}
                onClick={() => handleRoleChange(r.id)}
                disabled={r.disabled}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <FiAlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {renderField(
              "name",
              "Full name",
              "text",
              "John Doe",
              <FiUser className="auth-input-icon" />
            )}

            <div className="auth-form-grid">
              {renderField(
                "email",
                "Email address",
                "email",
                "you@example.com",
                <FiMail className="auth-input-icon" />,
                { autoComplete: "email" }
              )}
              {renderField(
                "phone",
                "Phone number",
                "tel",
                "+91 98765 43210",
                <FiPhone className="auth-input-icon" />,
                { autoComplete: "tel" }
              )}
            </div>

            <div className="auth-form-grid">
              <div
                className={`auth-field ${fieldErrors.password ? "input-error" : ""}`}
              >
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <span className="auth-field-error">
                    <FiAlertCircle size={13} />
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div
                className={`auth-field ${fieldErrors.confirmPassword ? "input-error" : ""}`}
              >
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="auth-input-wrap">
                  <FiLock className="auth-input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-pw"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <span className="auth-field-error">
                    <FiAlertCircle size={13} />
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {role === ROLES.DOCTOR && (
              <>
                <div className="auth-divider">Professional details</div>

                <div className="auth-form-grid">
                  <div
                    className={`auth-field ${fieldErrors.specialization ? "input-error" : ""}`}
                  >
                    <label htmlFor="specialization">Specialization</label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.specialization && (
                      <span className="auth-field-error">
                        <FiAlertCircle size={13} />
                        {fieldErrors.specialization}
                      </span>
                    )}
                  </div>

                  {renderField(
                    "experience",
                    "Experience (years)",
                    "number",
                    "e.g. 5",
                    null,
                    { min: 0 }
                  )}
                </div>

                <div className="auth-form-grid">
                  {renderField(
                    "qualification",
                    "Qualification",
                    "text",
                    "e.g. MBBS, MD"
                  )}
                  {renderField(
                    "fees",
                    "Consultation fee (₹)",
                    "number",
                    "e.g. 500",
                    null,
                    { min: 0 }
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting}
              style={{ marginTop: 8 }}
            >
              {submitting ? (
                <>
                  <span className="auth-spinner" />
                  Creating account...
                </>
              ) : (
                `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              )}
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
