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

export interface ServerSettings {
    sentry: SentryOptions;
    sgConnectApi: SGConnectApi;
    chatBotSettings: ChatBotSettings;
    googleReCaptchaSetting: GoogleReCaptchaSetting;
    proxy?: AxiosProxyConfig;
}

export interface ClientSettings {
    sentry: SentryOptions;
    userServiceApi: string;
    defaultOperatorId: string;
    googleReCaptchaSetting: GoogleReCaptchaSetting;
}
