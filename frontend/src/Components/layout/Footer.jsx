import ServicesHighlight from "./footer/ServicesHighlight";
import FoodConcierge from "./footer/FoodConcierge";
import FooterMain from "./footer/FooterMain";
import Newsletter from "./footer/Newsletter";
import BottomBar from "./footer/BottomBar";
// import AppBadges from "./AppBadges";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* <ServicesHighlight /> */}
      <FoodConcierge />
      <FooterMain />
      <Newsletter />
      <BottomBar />
      {/* <AppBadges /> */}
    </footer>
  );
};

export default Footer;
