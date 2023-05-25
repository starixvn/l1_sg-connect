import { PRIVATE_KEY } from "./constant";

function convertBufferToHex(buffer: ArrayBuffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (n) => ("0" + n.toString(16)).slice(-2)).join("");
}

function convertStringToBuffer(str: string) {
    var result = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i); /* w ww. ja  v  a 2s . co  m*/
    }
    return result;
}

export const getHMACSignature = async (message: string) => {
    const enc = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(PRIVATE_KEY),
        {
            name: "HMAC",
            hash: { name: "SHA-256" },
        },
        false,
        ["sign", "verify"]
    );

    const signature = await crypto.subtle.sign(
        {
            name: "HMAC",
        },
        key,
        convertStringToBuffer(message)
    );

    return convertBufferToHex(signature);
};
