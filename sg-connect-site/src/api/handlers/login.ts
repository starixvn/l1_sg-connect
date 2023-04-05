import { decrypt, encrypt } from "@/api/helper/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { ExpiredTimeInMilliseconds, PRIVATE_KEY, SG_API_PUBLIC_KEY } from "../constants";
import { encodePwd } from "../helper/encode";
import Axios from "axios";
import * as Sentry from "@sentry/nextjs";
import appSettings from "../../../configs.json";

interface EncryptData {
    username: string;
    timestamp: string;
    password: string;
}

const isValidEncryptData = (username: string, encryptData: EncryptData): boolean => {
    const { username: encryptUsername, timestamp, password } = encryptData;
    const reqTime = new Date(timestamp);
    const expireTime = new Date(reqTime.getTime() + ExpiredTimeInMilliseconds);

    return username == encryptUsername && password !== "" && new Date() < expireTime;
};

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { encryptedPassword, language, username } = req.body;
        const encryptData = JSON.parse(decrypt(encryptedPassword, PRIVATE_KEY) || "{}") as EncryptData;

        if (isValidEncryptData(username, encryptData)) {
            const { password } = encryptData;

            const encodeKey = `${Math.floor(Math.random() * 9000) + 1000}`;
            const encodePassword = encodePwd(password, encodeKey);

            const request = {
                Username: username,
                EncodeKey: encodeKey,
                EncryptedPassword: encrypt(encodePassword, SG_API_PUBLIC_KEY),
                Language: language,
            };

            const result = await Axios.post(`${appSettings.sgConnectApi.url}/login`, request).catch((error) => {
                Sentry.captureException(error);
            });

            res.send(result?.data);
        } else {
            res.status(400).end();
        }
    } catch (error) {
        res.status(500).end();
    }
};
