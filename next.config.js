module.exports = {
    webpack(config, { isServer, webpack }) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: {
                test: /\.(js|ts)x?$/,
            },
            use: ["@svgr/webpack"],
        });

        config.plugins.push(
            new webpack.DefinePlugin({
                "process.browser": "true",
            })
        );

        if (!isServer) {
            config.node = {
                fs: "empty",
            };
        }

        return config;
    },
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
};
