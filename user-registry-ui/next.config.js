const withCSS = require('@zeit/next-css')
module.exports = withCSS({
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: 'url-loader'
    })
    return config
  }
})
