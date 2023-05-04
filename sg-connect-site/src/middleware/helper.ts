import { PRIVATE_KEY } from "./constant";
import * as CryptoJS from "crypto-js";

export const getHMACSignature = (message: string) => {
    return CryptoJS.HmacSHA256(message, PRIVATE_KEY).toString(CryptoJS.enc.Hex);
};
