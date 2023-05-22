import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAuth } from "./middleware/auth";

export async function middleware(request: NextRequest) {
    if (true) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/404", request.url));
}

export const config = {
    matcher: "/login",
};
