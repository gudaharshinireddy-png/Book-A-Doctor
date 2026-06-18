import { Link } from "react-router-dom";
import { SPECIALIZATIONS } from "../utils/constants";

const ICONS = ["❤️", "🧠", "🦴", "👶", "👁️", "🦷"];

const Specializations = () => {
  return (
    <section className="specializations">
      <div className="section-header">
        <h2>Browse by Specialization</h2>
        <p>Find doctors based on their specialty</p>
      </div>

      <div className="special-grid">
        {SPECIALIZATIONS.slice(0, 6).map((spec, index) => (
          <Link
            key={spec}
            to={`/doctors?specialization=${encodeURIComponent(spec)}`}
            className="special-card"
          >
            <span className="special-icon">{ICONS[index]}</span>
            <h4>{spec}</h4>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Specializations;
