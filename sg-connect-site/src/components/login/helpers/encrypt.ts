const key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCX2tv81auMPajzyJADf1Iga5iJ
LHI7flt/ae0Bb6OoE6ZdN1puvX7cAKCfhRPrr6g5kViBt9zlChGd50ZHwuIxw/3n
GMmkMb8kI4UEBSh+Q7br7StITGtmlq/upfXtXYKlypZ6IejDOypUFTe7gZIGwe/M
qsD6xdP/PYXJauo2JwIDAQAB
-----END PUBLIC KEY-----`;

export const encrypt = async (text: string) => {
    const JSEncrypt = (await import("jsencrypt")).default;
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    return encrypt.encrypt(text);
};
