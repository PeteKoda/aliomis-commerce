
const path = require("path");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const withPreact = require('next-plugin-preact');


module.exports = withPreact({
    trailingSlash: true,
    
    webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        // config.plugins.push(
        //     new BundleAnalyzerPlugin({
        //         analyzerMode: 'server',
        //         analyzerPort: isServer ? 8888 : 8889,
        //         openAnalyzer: true,
        //     })
        // )


        return config
    },
    webpackDevMiddleware: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };

        return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles"), path.join(__dirname, 'assets/scss')],
    },
    images: {
        domains: ['aliomis.admin.w3vitals.com', 'aliomis-eshop.s3.amazonaws.com', 'admin.blog.aliomis.com', 'i2.wp.com', 'i1.wp.com', 'i0.wp.com'],
    },
});
