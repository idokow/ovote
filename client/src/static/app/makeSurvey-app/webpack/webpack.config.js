const path = require("path")

module.exports = {
  entry : "./static/app/makeSurvey-app/makeSurvey.js",
  mode : "production",
  output : {
    path: path.resolve(__dirname, "dist"),
    filename: "output.js"
  },
  devtool: "inline-source-map",
}