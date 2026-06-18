import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctorAppointments } from "../services/appointmentService";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import useAuth from "../hooks/useAuth";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await getDoctorAppointments();
        if (active) setAppointments(data);
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

  const formatDate = (dateValue) =>
    new Date(dateValue).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatDateTimeValue = (item) =>
    new Date(`${item.appointmentDate}T${item.appointmentTime}`);

  const stats = useMemo(() => {
    const pending = appointments.filter((item) => item.status === "pending").length;
    const approved = appointments.filter((item) => item.status === "approved").length;
    const rejected = appointments.filter((item) => item.status === "rejected").length;
    const completed = appointments.filter((item) => item.status === "completed").length;

    return {
      total: appointments.length,
      pending,
      approved,
      rejected,
      completed,
    };
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];

    return appointments
      .filter((item) => item.appointmentDate?.startsWith(todayDate))
      .sort((a, b) => formatDateTimeValue(a) - formatDateTimeValue(b));
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((item) => ["pending", "approved"].includes(item.status))
      .filter((item) => formatDateTimeValue(item) >= now)
      .sort((a, b) => formatDateTimeValue(a) - formatDateTimeValue(b))
      .slice(0, 5);
  }, [appointments]);

  const recentActivity = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5),
    [appointments]
  );

  if (loading) {
    return <LoadingSpinner message="Preparing your doctor dashboard..." />;
  }

  return (
    <div className="page-container doctor-page">
      <div className="page-header">
        <h1>Welcome, Dr. {user?.name}</h1>
        <p>Track patient requests, monitor your schedule, and manage your practice.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="doctor-stats-grid">
        <article className="doctor-stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.total}</p>
        </article>
        <article className="doctor-stat-card">
          <h3>Pending Requests</h3>
          <p>{stats.pending}</p>
        </article>
        <article className="doctor-stat-card">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </article>
        <article className="doctor-stat-card">
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </article>
      </section>

      <section className="doctor-dashboard-grid">
        <article className="panel-card">
          <div className="panel-head">
            <h2>Today&apos;s Appointments</h2>
            <Link to="/doctor/appointments">Manage</Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="panel-empty">No appointments scheduled for today.</p>
          ) : (
            <div className="panel-list">
              {todayAppointments.slice(0, 4).map((item) => (
                <div key={item._id} className="panel-list-item">
                  <div>
                    <h4>{item.patientId?.name || "Patient"}</h4>
                    <p>
                      {item.appointmentTime} · {item.patientId?.phone || item.patientId?.email}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel-card">
          <div className="panel-head">
            <h2>Upcoming Appointments</h2>
            <Link to="/doctor/appointments">View all</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="panel-empty">No upcoming appointments.</p>
          ) : (
            <div className="panel-list">
              {upcomingAppointments.map((item) => (
                <div key={item._id} className="panel-list-item">
                  <div>
                    <h4>{item.patientId?.name || "Patient"}</h4>
                    <p>
                      {formatDate(item.appointmentDate)} · {item.appointmentTime}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="doctor-dashboard-grid">
        <article className="panel-card">
          <div className="panel-head">
            <h2>Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="panel-empty">No recent activity.</p>
          ) : (
            <div className="panel-list">
              {recentActivity.map((item) => (
                <div key={item._id} className="panel-list-item stacked">
                  <div>
                    <h4>
                      {item.patientId?.name || "Patient"} ·{" "}
                      <span className="text-capitalize">{item.status}</span>
                    </h4>
                    <p>
                      {formatDate(item.appointmentDate)} at {item.appointmentTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel-card doctor-summary-card">
          <h2>Practice Summary</h2>
          <p>
            You have {stats.pending} pending requests and {stats.rejected} rejected requests to
            review. Keep your availability updated to improve patient booking success.
          </p>
          <Link to="/doctor/profile" className="btn-book btn-sm">
            Update Profile
          </Link>
        </article>
      </section>
    </div>
  );
};

export default DoctorDashboard;
