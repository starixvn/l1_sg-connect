module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: ["vi", "en", "id", "th", "zh_cn", "zh_tw"],
        localeDetection: false,
        detection: {
            order: ["querystring"],
            lookupQuerystring: "language",
        },
        fallbackLng: ["vi", "en", "id", "th", "zh_cn", "zh_tw"],
    },
};
