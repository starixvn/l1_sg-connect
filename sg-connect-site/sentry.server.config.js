import * as Sentry from "@sentry/nextjs";

import configs from "./configs.json";

Sentry.init({ ...configs.server.sentry, tags: { service: "sg-connect-site.SERVER" } });
