import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getMyAppointments } from "../services/appointmentService";
import { getNotifications } from "../services/notificationService";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [appointmentsRes, notificationsRes] = await Promise.all([
          getMyAppointments(),
          getNotifications(),
        ]);

        if (!active) return;
        setAppointments(appointmentsRes.data);
        setNotifications(notificationsRes.data);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load dashboard data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const pending = appointments.filter((item) => item.status === "pending").length;
    const approved = appointments.filter((item) => item.status === "approved").length;
    const completed = appointments.filter((item) => item.status === "completed").length;
    return {
      total: appointments.length,
      pending,
      approved,
      completed,
    };
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    return [...appointments]
      .filter((item) => ["pending", "approved"].includes(item.status))
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 4);
  }, [appointments]);

  const recentNotifications = useMemo(() => notifications.slice(0, 4), [notifications]);

  const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return <LoadingSpinner message="Preparing your dashboard..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome back, {user?.name}</h1>
        <p>Track appointments, notifications, and manage your healthcare journey.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="patient-stats-grid">
        <article className="patient-stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.total}</p>
        </article>
        <article className="patient-stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </article>
        <article className="patient-stat-card">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </article>
        <article className="patient-stat-card">
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </article>
      </section>

      <section className="patient-dashboard-grid">
        <article className="panel-card">
          <div className="panel-head">
            <h2>Upcoming Appointments</h2>
            <Link to="/appointments">View all</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="panel-empty">No upcoming appointments right now.</p>
          ) : (
            <div className="panel-list">
              {upcomingAppointments.map((item) => (
                <div key={item._id} className="panel-list-item">
                  <div>
                    <h4>{formatDate(item.appointmentDate)}</h4>
                    <p>{item.appointmentTime}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel-card">
          <div className="panel-head">
            <h2>Recent Notifications</h2>
            <Link to="/notifications">View all</Link>
          </div>
          {recentNotifications.length === 0 ? (
            <p className="panel-empty">No recent notifications.</p>
          ) : (
            <div className="panel-list">
              {recentNotifications.map((item) => (
                <div key={item._id} className="panel-list-item stacked">
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
                  </div>
                  <span className={`mini-dot ${item.isRead ? "read" : "unread"}`} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/doctors" className="quick-action-link">
            Find Doctors
          </Link>
          <Link to="/doctors" className="quick-action-link">
            Book Appointment
          </Link>
          <Link to="/appointments" className="quick-action-link">
            Manage Appointments
          </Link>
          <Link to="/profile" className="quick-action-link">
            View Profile
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
