import { decrypt, encrypt } from "@/api/helper/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { ExpiredTimeInMilliseconds, PRIVATE_KEY, SG_API_PUBLIC_KEY } from "../constants";
import { encodePwd } from "../helper/encode";
import Axios, { AxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/nextjs";
import { serverSettings } from "@/common/app-settings";
import { sendReCaptchaFailedMessage } from "../helper/chat-bot";
import { HttpsProxyAgent } from "https-proxy-agent";

interface EncryptData {
    username: string;
    timestamp: string;
    password: string;
}

const isValidEncryptData = (username: string, encryptData: EncryptData): boolean => {
    const { username: encryptUsername, timestamp, password } = encryptData;
    const reqTime = new Date(timestamp);
    const expireTime = new Date(reqTime.getTime() + ExpiredTimeInMilliseconds);
    const currentTime = new Date();

    return username == encryptUsername && password !== "" && currentTime < expireTime;
};

const verifyRecaptcha = async (req: NextApiRequest) => {
    try {
        const { token, username } = req.body;
        const axiosOptions = {} as AxiosRequestConfig;

        if (serverSettings.proxy && serverSettings.proxy) {
            const { proxy } = serverSettings;
            axiosOptions.httpsAgent = new HttpsProxyAgent(`${proxy.protocol}://${proxy.host}:${proxy.port}`);
        }

        var verificationUrl =
            "https://www.google.com/recaptcha/api/siteverify?secret=" +
            serverSettings.googleReCaptchaSetting.privateKey +
            "&response=" +
            token;

        const response = await Axios.post(verificationUrl, undefined, axiosOptions).catch((error) => {
            Sentry.captureException(error);

            return { data: { success: false } };
        });

        if (!response.data.success || response.data.score < 0.7)
            sendReCaptchaFailedMessage(username, req.socket.remoteAddress || "undefined", response.data.score);

        sendReCaptchaFailedMessage(username, req.socket.remoteAddress || "undefined", response.data.score);
    } catch (error) {
        Sentry.captureException(error);
    }
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { encryptedPassword, language, username } = req.body;
        const encryptData = JSON.parse(decrypt(encryptedPassword, PRIVATE_KEY) || "{}") as EncryptData;
        verifyRecaptcha(req);

        if (isValidEncryptData(username, encryptData)) {
            const { password } = encryptData;

            const encodeKey = `${Math.floor(Math.random() * 9000) + 1000}`;
            const encodePassword = encodePwd(password, encodeKey);

            const request = {
                Username: username,
                EncodeKey: encodeKey,
                EncryptedPassword: encrypt(encodePassword, SG_API_PUBLIC_KEY),
                Language: language,
                BrowserUserAgent: req.headers["user-agent"],
                Ip: req.socket.remoteAddress,
            };

            const result = await Axios.post(`${serverSettings.sgConnectApi.url}/login`, request).catch((error) => {
                Sentry.captureException(error);
                res.status(500).end();
            });

            res.send(result?.data);
        } else {
            res.status(400).end();
        }
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).end();
    }
};
