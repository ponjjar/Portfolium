const React = require('react');
const { View } = require('react-native');

// Return a dummy View component for any imported icon
module.exports = new Proxy({}, {
  get: function() {
    return function MockIcon() {
      return React.createElement(View);
    };
  }
});
