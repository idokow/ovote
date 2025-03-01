const path = require("path")

module.exports = {
  entry : "./static/app/dashboard-app/dashboard.js",
  mode : "production",
  output : {
    path: path.resolve(__dirname, "dist"),
    filename: "output.js"
  },
  devtool: "inline-source-map",
}