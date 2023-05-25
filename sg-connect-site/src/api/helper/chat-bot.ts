import { serverSettings } from "@/common/app-settings";
import Axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { Severity } from "@sentry/nextjs";

const Channels = {
    captchaFailed: "captchaFailed",
};

const post = async (channel: string, message: string, options?: any) => {
    const { chatBotSettings } = serverSettings;
    if (!chatBotSettings) {
        Sentry.captureMessage("chat-bot-helper has not been initialized properly.", { level: Severity.Error });
    }

    try {
        const defaultRequestTimeout = 5000;
        const { url, token, conversationIds, requestTimeout } = chatBotSettings;
        const requestConfigs = {
            timeout: options?.requestTimeout || requestTimeout || defaultRequestTimeout,
            headers: {},
        };

        await Axios.post(
            `${url}forwardwithtoken?token=${token}&conversationId=${conversationIds[channel]}&message=${message}`,
            {},
            requestConfigs
        );
    } catch (e) {
        Sentry.captureException(e);
    }
};

export const sendReCaptchaFailedMessage = async (username: string, ip: string, score: number) => {
    const { sentry } = serverSettings;

    const message = `${sentry.environment} - ${username} - ${ip} - ReCaptcha failed with score ${score}`;

    await post(Channels.captchaFailed, message);
};
