import React from "react";
import PropTypes from "prop-types";
import { getImageUrl } from "../../services/api";

const Image = ({
  src,
  alt,
  className,
  fallback = "/placeholder-food.jpg",
  ...props
}) => {
  const handleError = (e) => {
    if (fallback && e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.string,
};

export default Image;
