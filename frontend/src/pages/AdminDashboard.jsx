import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform activity</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card-admin">
              <h2>{stats.totalUsers}</h2>
              <p>Total Users</p>
            </div>
            <div className="stat-card-admin">
              <h2>{stats.totalDoctors}</h2>
              <p>Approved Doctors</p>
            </div>
            <div className="stat-card-admin accent">
              <h2>{stats.pendingDoctors}</h2>
              <p>Pending Applications</p>
            </div>
            <div className="stat-card-admin">
              <h2>{stats.totalAppointments}</h2>
              <p>Total Appointments</p>
            </div>
          </div>

          <div className="admin-quick-links">
            <Link to="/admin/doctors" className="quick-link-card">
              <h3>Review Doctor Applications</h3>
              <p>{stats.pendingDoctors} pending approval</p>
            </Link>
            <Link to="/admin/users" className="quick-link-card">
              <h3>Manage Users</h3>
              <p>{stats.totalUsers} registered users</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
