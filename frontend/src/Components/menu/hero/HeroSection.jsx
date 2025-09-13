import { memo } from "react";
import PropTypes from "prop-types";
import HeroHeading from "./HeroHeading";
import HeroFeatures from "./HeroFeatures";
import HeroSearch from "./HeroSearch";

const HeroSection = memo(({ search, setSearch, onSubmit, menuItems }) => {
  const safeSearch = search ?? "";

  return (
    <>
      <section className="relative py-16 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeroHeading />
          <HeroFeatures />
        </div>
      </section>

      <HeroSearch
        safeSearch={safeSearch}
        setSearch={setSearch}
        onSubmit={onSubmit}
        menuItems={menuItems}
      />
    </>
  );
});

HeroSection.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  menuItems: PropTypes.array.isRequired,
};

HeroSection.defaultProps = { search: "" };
HeroSection.displayName = "HeroSection";

export default HeroSection;
