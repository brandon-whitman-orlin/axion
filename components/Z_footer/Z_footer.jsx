import React from 'react';
import PropTypes from 'prop-types';

import './Z_footer.css';

const Z_footer = ({ name, logo, children }) => {
  return (
    <div className="footer-nav">
      <div className="footer-column">
        <a href="/" rel="noopener noreferrer" className="site-name">
          {logo}
          <h2>{name}</h2>
        </a>
      </div>
      {children.map((list, index) => (
        <div key={index} className="footer-column">
          {list.length === 1 ? (
            list[0]
          ) : (
            list.map((item, idx) => <div key={idx}>{item}</div>)
          )}
        </div>
      ))}
    </div>
  );
};

Z_footer.propTypes = {
  name: PropTypes.node.isRequired,
  logo: PropTypes.node.isRequired,
  children: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
};

export default Z_footer;
