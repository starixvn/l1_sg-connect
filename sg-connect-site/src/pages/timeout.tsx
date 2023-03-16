import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Timeout() {
    const router = useRouter();
    const { i18n, t } = useTranslation("common");

    useEffect(() => {
        if (router.isReady) {
            i18n.changeLanguage(router.query?.language as string);
        }
    }, [router]);

    const redirectToLoginPage = () => {
        router.push("/");
    };

    return (
        <div className="time-out">
            <div>
                <img className="image" src="/images/timeout/icon-expired.png" alt="Image" />
                <p className="title">{t("sessionTimeout")}</p>
                <button type="button" onClick={redirectToLoginPage}>
                    {t("login")}
                </button>
            </div>
        </div>
    );
}

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}
