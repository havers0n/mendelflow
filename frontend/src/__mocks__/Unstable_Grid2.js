const React = require('react');

// Mock MUI's Unstable_Grid2: render a plain div container
function Grid({ children, ...props }) {
  // Remove `container` prop to avoid passing unsupported boolean to DOM
  const { container, ...rest } = props;
  return React.createElement('div', rest, children);
}

module.exports = Grid; 