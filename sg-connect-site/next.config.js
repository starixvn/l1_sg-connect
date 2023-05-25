/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const configs = require("./configs.json");
const { withSentryConfig } = require("@sentry/nextjs");

const securityHeaders = [
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
];

const nextConfig = withSentryConfig({
    reactStrictMode: true,
    i18n,
    publicRuntimeConfig: { ...configs.client },
    serverRuntimeConfig: { ...configs.server },
    productionBrowserSourceMaps: configs.enableSourceMap,
    sentry: {
        disableServerWebpackPlugin: true,
        disableClientWebpackPlugin: true,
    },
    excludeFile: (str) => /\*.{spec,test}.js/.test(str),
    async headers() {
        return [
            {
                source: "/:path*",
                headers: securityHeaders,
            },
        ];
    },
    poweredByHeader: false,
});

module.exports = nextConfig;
