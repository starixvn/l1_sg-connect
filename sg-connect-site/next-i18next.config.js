module.exports = {
    i18n: {
        defaultLocale: "en-US",
        locales: ["vi-VN", "en-US", "id-ID", "th-TH", "zh-CN", "zh-TW"],
        localeDetection: false,
        detection: {
            order: ["querystring"],
            lookupQuerystring: "language",
        },
        fallbackLng: ["vi-VN", "en-US", "id-ID", "th-TH", "zh-CN", "zh-TW"],
    },
};
