const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://55.11.54.120:18086',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/'
      }
    })
  )
}