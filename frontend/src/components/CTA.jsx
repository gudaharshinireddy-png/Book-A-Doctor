import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Your Next Appointment Is One Click Away</h2>
        <p>
          Connect with trusted healthcare professionals and schedule
          appointments instantly.
        </p>
        <Link to="/register" className="cta-button">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default CTA;
