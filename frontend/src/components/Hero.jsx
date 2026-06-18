import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/hero.png";

const Hero = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/doctors?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-badge">
          Trusted Healthcare Platform
        </span>

        <h1>
          Care that feels
          <span> personal</span>,
          booking that feels effortless.
        </h1>

        <p>
          Find trusted specialists, browse real availability, and book
          appointments instantly.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search doctors or specialties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="hero-features">
          <span>24/7 Booking</span>
          <span>Verified Doctors</span>
          <span>Secure & Private</span>
        </div>
      </div>

      <div className="hero-right">
        <img src={hero} alt="Healthcare professional with patient" />
      </div>
    </section>
  );
};

export default Hero;
