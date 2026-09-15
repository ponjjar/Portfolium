const RN = require('react-native');

module.exports = {
  __esModule: true,
  default: {
    View: RN.View,
    Text: RN.Text,
    ScrollView: RN.ScrollView,
    createAnimatedComponent: (c) => c,
  },
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (fn) => fn(),
  withTiming: (toValue, _config, cb) => {
    if (cb) cb(true);
    return toValue;
  },
  withRepeat: (anim) => anim,
  withSequence: (...anims) => anims[0],
  Easing: {
    bezier: () => (t) => t,
    inOut: () => (t) => t,
    ease: () => (t) => t,
    linear: () => (t) => t,
  },
  runOnJS: (fn) => fn,
  useAnimatedScrollHandler: (handlers) => {
    return (event) => {
      if (typeof handlers === 'function') handlers(event);
      if (handlers && handlers.onScroll) handlers.onScroll(event);
    };
  },
  interpolate: (_value, _input, output, _extrapolate) => {
    return output && output.length > 0 ? output[0] : 0;
  },
  Extrapolation: {
    CLAMP: 'clamp',
    EXTEND: 'extend',
    IDENTITY: 'identity',
  },
  configureReanimatedLogger: () => {},
  ReanimatedLogLevel: {
    warn: 'warn',
    error: 'error',
  },
};
