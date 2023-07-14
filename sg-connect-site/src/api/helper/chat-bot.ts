import { serverSettings } from "@/common/app-settings";
import Axios, { AxiosRequestConfig } from "axios";
import { Severity, captureMessage, captureException } from "@sentry/nextjs";
import { HttpsProxyAgent } from "https-proxy-agent";

const Channels = {
    captchaFailed: "captchaFailed",
};

const post = async (channel: string, message: string, options?: any) => {
    const { chatBotSettings } = serverSettings;
    if (!chatBotSettings) {
        captureMessage("chat-bot-helper has not been initialized properly.", { level: Severity.Error });
    }

    try {
        const defaultRequestTimeout = 5000;
        const { url, token, conversationIds, requestTimeout } = chatBotSettings;
        const requestConfigs: AxiosRequestConfig = {
            timeout: options?.requestTimeout || requestTimeout || defaultRequestTimeout,
            headers: {},
        };

        if (serverSettings.proxy && serverSettings.proxy) {
            const { proxy } = serverSettings;
            requestConfigs.httpsAgent = new HttpsProxyAgent(`${proxy.protocol}://${proxy.host}:${proxy.port}`);
        }

        await Axios.post(
            `${url}forwardwithtoken?token=${token}&conversationId=${conversationIds[channel]}&message=${message}`,
            {},
            requestConfigs
        );
    } catch (e) {
        captureException(e);
    }
};

export const sendReCaptchaFailedMessage = async (username: string, ip: string, score: number) => {
    const { sentry } = serverSettings;

    const message = `${sentry.environment} - ${username} - ${ip} - ReCaptcha failed with score ${score}`;

    await post(Channels.captchaFailed, message);
};
