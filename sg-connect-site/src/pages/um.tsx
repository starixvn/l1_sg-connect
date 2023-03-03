import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { UMInfo, getUnfinishedUM } from "@/shared/userService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import appSettings from "@/common/app-settings";

export default function UM() {
    const [umInfo, setUMInfo] = useState<UMInfo | null>(null);
    const [isUM, setIsUM] = useState<boolean>(true);
    const [operatorId, setOperatorId] = useState<string>();
    const router = useRouter();
    const { i18n, t } = useTranslation("common");

    useEffect(() => {
        if (router.isReady) {
            if (router.query?.operatorId) {
                setOperatorId(router.query?.operatorId as string);
            }
            getUMInfo(router.query?.operatorId as string);
            i18n.changeLanguage((router.query?.language as string) ?? "en");
        }
    }, [router]);

    useEffect(() => {
        !isUM && router.push("/login");
    }, [isUM]);

    useEffect(() => {
        const interval = setInterval(() => getUMInfo(operatorId), 1000 * 60); // 1m
        return () => clearInterval(interval);
    }, [operatorId]);

    const getUMInfo = (operator = appSettings.defaultOperatorId) => {
        getUnfinishedUM(operator || appSettings.defaultOperatorId).then((data) => {
            setIsUM(data.isUM);
            setUMInfo(data.umInfo);
        });
    };

    const convertToGMT8 = (date: Date): string => {
        return dayjs(
            new Date(date).toLocaleString("en-US", {
                timeZone: "Asia/Manila",
            })
        ).format("HH:mm DD/MM/YYYY");
    };

    return (
        <div className="um">
            {umInfo && (
                <div>
                    <div>
                        <img className="logo" src="/images/um/logo.png" alt="Image" decoding="async" />
                    </div>
                    <img className="image" src="/images/um/icon-um.png" alt="Image" />
                    <div className="title">{t("maintenanceTime")}</div>
                    <div>{`(GMT + 8)`}</div>
                    <div className="time">
                        {umInfo?.start && (
                            <div>
                                {t("from")} <span>{convertToGMT8(umInfo.start)}</span>
                            </div>
                        )}
                        {umInfo?.end && (
                            <div>
                                {t("to")} <span>{convertToGMT8(umInfo.end)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
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
