
const path = require("path");
module.exports = {
    trailingSlash: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
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
        domains: ['w3.aliomis.com','aliomis-eshop.s3.amazonaws.com','admin.blog.aliomis.com'],
    },
};
