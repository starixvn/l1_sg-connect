import { AxiosProxyConfig } from "axios";

interface SGConnectApi {
    url: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}

interface ChatBotSettings {
    url: string;
    token: string;
    requestTimeout: number;
    conversationIds: { [key: string]: number };
}

interface GoogleReCaptchaSetting {
    siteKey: string;

    privateKey: string;
}

export default interface AppSettings {
    sentry: SentryOptions;
    userServiceApi: string;
    sgConnectApi: SGConnectApi;
    system: string;
    defaultOperatorId: string;

    chatBotSettings: ChatBotSettings;

    googleReCaptchaSetting: GoogleReCaptchaSetting;

    proxy?: AxiosProxyConfig;
}
