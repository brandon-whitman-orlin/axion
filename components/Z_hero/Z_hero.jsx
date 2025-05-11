import React from "react";
import PropTypes from "prop-types";
import "./Z_hero.css";

const Z_hero = ({ img, alt, attribution, objectPos, children }) => {
  return (
    <div className="hero" style={{ "--backgroundPos": objectPos }}>
      <img src={img} alt={alt} className="hero-image" />
      {attribution && <p className="imageAttribution">Image from {attribution}</p>}
      <div className="hero-content">{children}</div>
    </div>
  );
};

Z_hero.defaultProps = {
  attribution: "",
  objectPos: "center",
};

Z_hero.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  attribution: PropTypes.string,
  objectPos: PropTypes.string,
};

export default Z_hero;
