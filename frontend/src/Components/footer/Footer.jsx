import ServicesHighlight from "./ServicesHighlight";
import FoodConcierge from "./FoodConcierge";
import FooterMain from "./FooterMain";
import Newsletter from "./Newsletter";
import BottomBar from "./BottomBar";
// import AppBadges from "./AppBadges";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <ServicesHighlight />
      <FoodConcierge />
      <FooterMain />
      <Newsletter />
      <BottomBar />
      {/* <AppBadges /> */}
    </footer>
  );
};

export default Footer;
