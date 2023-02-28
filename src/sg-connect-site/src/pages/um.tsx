import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { languageMapper } from "@/shared/constants";
import { UMInfo, getUnfinishedUM } from "@/shared/userService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import bg from "../../public/static/images/um-bg.jpg";

export default function UM() {
    const [umInfo, setUMInfo] = useState<UMInfo>();
    const [operatorId, setOperatorId] = useState<string>();
    const router = useRouter();
    const { i18n, t } = useTranslation("common");

    useEffect(() => {
        if (router.isReady) {
            router.query?.operatorId && setOperatorId(router.query?.operatorId as string);
            const language = languageMapper[(router.query?.language as string) ?? "en-US"];
            i18n.changeLanguage(language);
        }
    }, [router]);

    useEffect(() => {
        umInfo?.finish && router.push("/login");
    }, [umInfo]);

    useEffect(() => {
        const interval = setInterval(() => getUMInfo(), 1000 * 60); // 1m
        getUMInfo();
        return () => clearInterval(interval);
    }, []);

    const getUMInfo = () => {
        getUnfinishedUM(operatorId).then((data) => setUMInfo(data));
    };

    const convertToGMT8 = (date: Date): string => {
        return dayjs(
            new Date(
                date.toLocaleString("en-US", {
                    timeZone: "Asia/Manila",
                })
            )
        ).format("DD/MM/YYYY hh:mm A");
    };

    return (
        <div className="um">
            <div>
                <Image className="image" src={bg} alt="Image" />
                <h1 className="text-center">{t("maintenanceTime")}</h1>
                <p>{`(GMT +8)`}</p>
                <div>
                    {umInfo?.start && (
                        <p>
                            {t("from")} <b>{convertToGMT8(new Date())}</b>
                        </p>
                    )}
                    {umInfo?.end && (
                        <p>
                            {t("to")} <b>{convertToGMT8(new Date())}</b>
                        </p>
                    )}
                </div>
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
