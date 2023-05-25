import getConfig from "next/config";

import { ClientSettings, ServerSettings } from "./type";

const clientSettings: ClientSettings = getConfig().publicRuntimeConfig;
const serverSettings: ServerSettings = getConfig().serverRuntimeConfig;

export default clientSettings;

export { serverSettings, clientSettings };
