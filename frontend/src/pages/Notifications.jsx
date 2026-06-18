import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";
import LoadingSpinner from "../components/LoadingSpinner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await getNotifications();
        if (active) setNotifications(data);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load notifications");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as read");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return <LoadingSpinner message="Loading notifications..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated on your appointments and account activity</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="notification-header-tools">
        <span className="notification-badge">
          Unread: {notifications.filter((item) => !item.isRead).length}
        </span>
        <div className="appointment-filters">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "filter-btn active" : "filter-btn"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <h3>No notifications</h3>
          <p>You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications
            .filter((notif) => {
              if (activeTab === "all") return true;
              if (activeTab === "read") return notif.isRead;
              return !notif.isRead;
            })
            .map((notif) => (
            <div
              key={notif._id}
              className={`notification-card ${notif.isRead ? "read" : "unread"}`}
            >
              <div className="notification-content">
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
                <span className="notification-time">
                  {formatDate(notif.createdAt)}
                </span>
              </div>
              {!notif.isRead && (
                <button
                  type="button"
                  className="btn-outline-primary btn-sm"
                  onClick={() => handleMarkRead(notif._id)}
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
