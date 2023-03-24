import { LanguageFlagMapper } from "@/common/constants/language";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import Styles from "./styles.module.scss";

interface Props {
    langCode: string;
    onUpdateLanguage: Function;
}

export default function LanguageSelector(props: Props) {
    const { langCode, onUpdateLanguage } = props;
    const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
    const { t } = useTranslation("common");
    const { i18n } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const updateLanguage = (langCode: string) => {
        onUpdateLanguage(langCode);
        setIsOpenPopup(false);
        i18n.changeLanguage(langCode);
    };

    useEffect(() => {
        i18n.changeLanguage(langCode);
    }, [langCode, i18n]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!wrapperRef?.current?.contains(event.target) && !btnRef?.current?.contains(event.target)) {
                setIsOpenPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, btnRef]);

    return (
        <>
            <button
                className={`${Styles["language-btn"]} ${isOpenPopup ? Styles["show"] : ""}`}
                ref={btnRef}
                onClick={() => setIsOpenPopup(!isOpenPopup)}
            >
                <img src={`/images/flags/${LanguageFlagMapper[langCode]}.png`} alt="flag-icon" className={Styles["flag-icon"]} />
                <label className={Styles["current-lang-name"]}>{t(langCode)}</label>
                <i className={Styles["caret-down"]}></i>
            </button>
            {isOpenPopup && (
                <>
                    <div className={`${Styles["overlay"]}`}></div>
                    <div ref={wrapperRef} className={Styles["language-selector"]}>
                        {Object.keys(LanguageFlagMapper).map((code) => {
                            const isSelected = code === langCode;

                            return (
                                <button className={Styles["select-lang-btn"]} key={code} onClick={() => updateLanguage(code)}>
                                    <img
                                        src={`/images/flags/${LanguageFlagMapper[code]}.png`}
                                        alt="flag-icon"
                                        className={Styles["flag-icon"]}
                                    />
                                    <div className={`${Styles["locale-name"]} ${isSelected ? "" : Styles["blur"]}`}>{t(code)}</div>
                                    <div className={Styles["status"]}>
                                        {isSelected && <span className={`${Styles["check-icon"]} icon-check`}></span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
}
