module.exports = {
    webpack(config, { isServer, webpack }) {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.(js|ts)x?$/,
            use: ["@svgr/webpack"],
        });

        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
};
