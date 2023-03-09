import React, { useEffect, useRef } from "react";

import Styles from "./styles.module.scss";

type Props = {
    onCloseModal: Function;
    content: string;
};

const BaseDialog: React.FC<Props> = ({ onCloseModal, content }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!wrapperRef?.current?.contains(event.target)) {
                onCloseModal && onCloseModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <>
            <div className={`overlay-mask ${Styles["overlay"]}`}></div>
            <div ref={wrapperRef} className={Styles.popup}>
                <div className={Styles.container}>
                    <div className={Styles.header}>
                        <i className={Styles["close-icon"]} onClick={() => onCloseModal()}></i>
                    </div>
                    <div className={Styles.title}>Notification</div>
                    <div className={Styles.content}>Your Account is locked. Please contact CSD to unlock your account.</div>
                </div>
            </div>
        </>
    );
};

export default BaseDialog;
