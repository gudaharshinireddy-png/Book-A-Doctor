import Hero from "../components/Hero";
import Specializations from "../components/Specializations";
import FeaturedDoctors from "../components/FeaturedDoctors";
import Statistics from "../components/Statistics";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <Specializations />
      <FeaturedDoctors />
      <Statistics />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;