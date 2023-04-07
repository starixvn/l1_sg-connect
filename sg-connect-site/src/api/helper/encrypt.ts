import * as crypto from "crypto";

const encrypt = (text: string, publicKey: string) => {
    const buffer = Buffer.from(text);
    const encrypted = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer);

    return encrypted.toString("base64");
};

const decrypt = (text: string, privateKey: string) => {
    const buffer = Buffer.from(text, "base64");
    const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer);
    return decrypted.toString("utf8");
};

export { encrypt, decrypt };
