interface SGConnectApi {
    url: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}

export default interface AppSettings {
    sentry: SentryOptions;
    userServiceApi: string;
    sgConnectApi: SGConnectApi;
    system: string;
}
