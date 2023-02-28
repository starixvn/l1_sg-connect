import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { languageMapper } from "@/shared/constants";
import { UMInfo, getUnfinishedUM } from "@/shared/userService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import bg from "../../public/images/um-bg.jpg";
import Config from "../configs.json";

const defaultUMInfo: UMInfo = {
    finish: false,
    end: new Date(),
    start: new Date(),
    operatorId: "",
};

export default function UM() {
    const [umInfo, setUMInfo] = useState<UMInfo>(defaultUMInfo);
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
            const language = languageMapper[(router.query?.language as string) ?? "en-US"];
            i18n.changeLanguage(language);
        }
    }, [router]);

    useEffect(() => {
        !isUM && router.push("/login");
    }, [isUM]);

    useEffect(() => {
        const interval = setInterval(() => getUMInfo(operatorId), 1000 * 60); // 1m
        return () => clearInterval(interval);
    }, [operatorId]);

    const getUMInfo = (operator = Config.defaultOperatorId) => {
        getUnfinishedUM(operator).then((data) => {
            setIsUM(data.isUM);
            setUMInfo(data.umInfo);
        });
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
            {umInfo && (
                <div>
                    <Image className="image" src={bg} alt="Image" />
                    <h1 className="text-center">{t("maintenanceTime")}</h1>
                    <p>{`(GMT +8)`}</p>
                    <div>
                        {umInfo?.start && (
                            <p>
                                {t("from")} <b>{convertToGMT8(umInfo.start)}</b>
                            </p>
                        )}
                        {umInfo?.end && (
                            <p>
                                {t("to")} <b>{convertToGMT8(umInfo.end)}</b>
                            </p>
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
