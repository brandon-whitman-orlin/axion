import React from "react";
import "./Tooltip.css";

const Tooltip = ({ id, children, tooltipText }) => (
  <div className="tooltip-wrapper">
    {children}
    <div className="tooltip" role="tooltip" id={id}>
      {tooltipText}
    </div>
  </div>
);

export default Tooltip;
