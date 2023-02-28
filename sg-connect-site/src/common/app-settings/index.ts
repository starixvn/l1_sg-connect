import getConfig from "next/config";

import AppSettings from "./type";

const appSettings: AppSettings = getConfig().publicRuntimeConfig;

export default appSettings;
