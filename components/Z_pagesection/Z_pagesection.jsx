import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./Z_pagesection.css";

const Z_pagesection = ({ children }) => {
  return (
    <section className="page-section">
        {children}
    </section>
  );
};

Z_pagesection.propTypes = {
  children: PropTypes.node,
};

export default Z_pagesection;