
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
        /**
            "/cdp-web": {
                target: "http://localhost:3000",
                secure: false,
                // cookie JSESSIONID设置了httpOnly不能重写cookie到target，故无效
                cookieDomainRewrite: "localhost",
                changeOrigin: true,
                pathRewrite: {
                    "^/cdp-web": "/cdp-web"
                }
            }
        */
            '/cdp-web': {
                target: 'http://192.168.19.183',
                secure: false,
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/cdp-web': '/cdp-web'
                },
                headers: {
                    Cookie: 'cdp-session-id=FEB2EF133427337C342F6724E4524F3F;', // JSESSIONID=937286E9B4F243A175F01CAF77582418;
                    Referer: 'localhost/cdp/',
                    Host: '192.168.19.183'
                }
            }
        },

        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'cheap-module-eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,
        useEslint: false,
        cssSourceMap: false
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
