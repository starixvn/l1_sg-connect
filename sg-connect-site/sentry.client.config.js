import * as Sentry from "@sentry/nextjs";

import configs from "./configs.json";

Sentry.init({ ...configs.client.sentry, ignoreErrors: ["Network Error"], tags: { service: "sg-connect-site.CLIENT" } });
