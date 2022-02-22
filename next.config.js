const withTM = require("next-transpile-modules")(["react-hook-mousetrap"]);

module.exports = withTM({
  // future: {
  //   webpack5: false, // you want to keep using Webpack 4
  // },
});
