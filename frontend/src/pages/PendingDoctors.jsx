import { useEffect, useState } from "react";
import {
  getPendingDoctors,
  approveDoctor,
} from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const PendingDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState(null);

  const fetchDoctors = async () => {
    try {
      const { data } = await getPendingDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await getPendingDoctors();
        if (active) setDoctors(data);
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load applications");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleApprove = async (id) => {
    setApproving(id);

    try {
      await approveDoctor(id);
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading applications..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Pending Doctor Applications</h1>
        <p>Review and approve doctor registration requests</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {doctors.length === 0 ? (
        <div className="empty-state">
          <h3>No pending applications</h3>
          <p>All doctor applications have been reviewed.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fees</th>
                <th>Hospital</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.userId?.name}</td>
                  <td>{doctor.userId?.email}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.experience} yrs</td>
                  <td>₹{doctor.fees}</td>
                  <td>{doctor.hospital || "—"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-book btn-sm"
                      disabled={approving === doctor._id}
                      onClick={() => handleApprove(doctor._id)}
                    >
                      {approving === doctor._id ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingDoctors;
