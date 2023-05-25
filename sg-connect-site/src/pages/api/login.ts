import { NextApiRequest, NextApiResponse } from "next";
import { handler } from "@/api/handlers/login";

export default function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        handler(req, res);
    } else {
        res.status(405).end();
    }
}
