import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page-container">
    <div className="empty-state">
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn-book">
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;
