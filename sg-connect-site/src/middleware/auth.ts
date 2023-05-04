import { NextRequest, userAgent } from "next/server";
import { getHMACSignature } from "./helper";

export const isAuth = (request: NextRequest) => {
    const ua = userAgent(request).ua;
    const uaSignature = getHMACSignature(ua);
    const header = new Headers(request.headers);
    const token = header.get("Authorization");

    return token == uaSignature;
};
