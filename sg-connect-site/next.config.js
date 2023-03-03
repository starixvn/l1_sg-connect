/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const configs = require("./configs.json");
const { withSentryConfig } = require("@sentry/nextjs");
const { redirect } = require("next/dist/server/api-utils");

const appSettings = {
    ...configs,
};

const nextConfig = withSentryConfig({
    reactStrictMode: true,
    i18n,
    publicRuntimeConfig: appSettings,
    productionBrowserSourceMaps: configs.enableSourceMap,
    sentry: {
        disableServerWebpackPlugin: true,
        disableClientWebpackPlugin: true,
    },
    excludeFile: (str) => /\*.{spec,test}.js/.test(str),
    redirect() {
        return [
            {
                source: "/login",
                destination: "/",
                permanent: true,
            },
        ];
    },
});

module.exports = nextConfig;
