module.exports = {
    i18n: {
        defaultLocale: "en-US",
        locales: ["en-US", "vi-VN", "id-ID", "th-TH", "zh-CN", "zh-TW"],
        localeDetection: false,
        detection: {
            order: ["querystring"],
            lookupQuerystring: "language",
        },
        fallbackLng: ["en-US", "vi-VN", "id-ID", "th-TH", "zh-CN", "zh-TW"],
    },
};
