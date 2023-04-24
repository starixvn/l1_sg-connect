import "@/styles/globals.scss";

import { appWithTranslation } from "next-i18next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import appSettings from "@/common/app-settings";

import type { AppProps } from "next/app";
function App({ Component, pageProps }: AppProps) {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={appSettings.googleReCaptchaSetting.siteKey}>
            <Component {...pageProps} />
        </GoogleReCaptchaProvider>
    );
}
export default appWithTranslation(App);
