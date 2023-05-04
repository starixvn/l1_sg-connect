import { NextRequest, userAgent } from "next/server";
import { getHMACSignature } from "./helper";

export const isAuth = async (request: NextRequest) => {
    const ua = userAgent(request).ua;
    const uaSignature = await getHMACSignature(ua);
    const header = new Headers(request.headers);
    const token = header.get("Authorization");

    return token == uaSignature;
};
