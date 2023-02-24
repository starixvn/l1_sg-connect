import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { languageMapper } from "@/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import bg from "../../public/static/images/um-bg.jpg";

type UM = {
    finish: boolean;
};

export default function UM() {
    const [umInfo, setUMInfo] = useState<UM>();
    const router = useRouter();
    const { i18n, t } = useTranslation("common");

    useEffect(() => {
        if (router.isReady) {
            const language = languageMapper[(router.query?.language as string) ?? "en-US"];
            i18n.changeLanguage(language);
        }
    }, [router]);

    useEffect(() => {
        umInfo?.finish && router.push("/login");
    }, [umInfo]);

    useEffect(() => {
        let interval = setInterval(() => getUMInfo(), 1000 * 60); // 1m
        return () => clearInterval(interval);
    });

    const getUMInfo = () => {
        setUMInfo({ finish: false });
    };

    return (
        <div className="um">
            <div>
                <Image className="image" src={bg} alt="Image" />
                <h1 className="text-center">UM</h1>
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
