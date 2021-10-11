module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js', './styles/**/*.css'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};