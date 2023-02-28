import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { languageMapper } from "@/shared/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import bg from "../../public/images/timeout-bg.jpg";

export default function Timeout() {
    const router = useRouter();
    const { i18n, t } = useTranslation("common");

    useEffect(() => {
        if (router.isReady) {
            const language = languageMapper[(router.query?.language as string) ?? "en-US"];
            i18n.changeLanguage(language);
        }
    }, [router]);

    const redirectToLoginPage = () => {
        router.push("/login");
    };

    return (
        <div className="time-out">
            <div>
                <Image className="image" src={bg} alt="Image" />
                <p className="text-center title">{t("sessionTimeout")}</p>
                <button type="button" className="btn btn-info" onClick={redirectToLoginPage}>
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
