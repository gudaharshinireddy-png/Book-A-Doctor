import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { loginUser } from "../services/authService";
import { getDashboardPath } from "../utils/navigation";
import AuthBranding from "../components/auth/AuthBranding";
import "../styles/AuthPages.css";

const REMEMBER_KEY = "doctorcare_remember_email";

const validateLogin = (values) => {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);
    return { email: savedEmail || "", password: "" };
  });
  const [rememberMe, setRememberMe] = useState(() =>
    Boolean(localStorage.getItem(REMEMBER_KEY))
  );
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.message || "");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLogin(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data } = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = data?.token || data?.data?.token;
      const userPayload = data?.user || data?.data || data;
      const resolvedRole = userPayload?.role;

      if (!token || !resolvedRole) {
        throw new Error("Invalid login response");
      }

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, formData.email.trim());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      const userData = {
        _id: userPayload._id,
        name: userPayload.name,
        email: userPayload.email,
        role: resolvedRole,
      };

      login(userData, token);

      const redirectTo =
        location.state?.from?.pathname || getDashboardPath(resolvedRole);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthBranding variant="login" />

      <div className="auth-form-panel">
        <div className="auth-glass-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your healthcare dashboard</p>
          </div>

          {success && (
            <div className="auth-alert auth-alert-success">{success}</div>
          )}

          {error && (
            <div className="auth-alert auth-alert-error">
              <FiAlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div
              className={`auth-field ${fieldErrors.email ? "input-error" : ""}`}
            >
              <label htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <span className="auth-field-error">
                  <FiAlertCircle size={13} />
                  {fieldErrors.email}
                </span>
              )}
            </div>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="mailto:support@doctorcare.com" className="auth-forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="auth-footer-link">
            Don&apos;t have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
