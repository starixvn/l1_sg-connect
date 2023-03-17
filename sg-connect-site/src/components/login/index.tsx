import appSettings from "@/common/app-settings";
import ErrorCodeDictionary from "@/common/constants/error-code-dictionary";
import { DefaultLanguage } from "@/common/constants/language";
import { getUnfinishedUM } from "@/shared/userService";
import * as Sentry from "@sentry/nextjs";
import Axios from "axios";
import crypto from "crypto";
import Router from "next/router";
import React from "react";
import { withTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import LanguageSelector from "./components/language-selector";
import NotificationPopup from "./components/notification-popup";
import { encodePwd } from "./helpers/encode";
import { encrypt } from "./helpers/encrypt";
import { getStorage, LocalStorageKeys, setStorage } from "./helpers/local-storage";
import Styles from "./styles.module.scss";

const MinHeightKeyBoard = 300;

interface Props {
    t: Function;
}

interface State {
    username: string;
    password: string;
    passwordHint: boolean;
    isUM: boolean;
    language: string;

    showNotification: boolean;

    notificationContent: string;

    isKeyboardOpen: boolean;
}

class Login extends React.Component<Props, State> {
    private UMInterval: any;

    constructor(props: any) {
        super(props);

        this.state = {
            username: "",
            password: "",
            passwordHint: false,
            isUM: true,
            language: "en-US",
            showNotification: false,
            notificationContent: "",
            isKeyboardOpen: false,
        };
    }

    setIsKeyboardOpen(isOpen: boolean) {
        this.setState({ isKeyboardOpen: isOpen });
    }

    hideNotification() {
        this.setState({ showNotification: false, notificationContent: "" });
    }

    showNotification(content: string) {
        this.setState({ showNotification: true, notificationContent: content });
    }

    updatePasswordHint() {
        this.setState({ passwordHint: !this.state.passwordHint });
    }

    onInputUsernameChange(event: any) {
        const value = event.target.value;

        this.setState({ username: value });
    }

    onInputPasswordChange(event: any) {
        const value = event.target.value;

        this.setState({ password: value });
    }

    updateLanguage(language: string) {
        this.setState({ language });
        setStorage(LocalStorageKeys.language, language);
    }

    keyboardOpenListener = () => {
        const newState = window.screen.height - MinHeightKeyBoard > (window.visualViewport?.height ?? 0);

        if (this.state.isKeyboardOpen != newState) {
            this.setIsKeyboardOpen(newState);
        }
    };

    async componentDidMount() {
        const language = getStorage(LocalStorageKeys.language);
        const username = getStorage(LocalStorageKeys.username);
        this.setState({ language: language ?? DefaultLanguage, username: username ?? "" });

        this.getUMInfo();
        this.UMInterval = setInterval(() => this.getUMInfo(), 1000 * 60); // 1m

        if (isMobile && typeof visualViewport != "undefined") {
            window.visualViewport?.addEventListener("resize", this.keyboardOpenListener);
        }
    }

    componentWillUnmount(): void {
        this.UMInterval && clearInterval(this.UMInterval);
        isMobile && window.visualViewport?.removeEventListener("resize", this.keyboardOpenListener);
    }

    getUMInfo = () => {
        getUnfinishedUM(appSettings.defaultOperatorId).then((data) => {
            const { language } = this.state;
            if (data.isUM) {
                this.UMInterval && clearInterval(this.UMInterval);
                this.setState({ isUM: true }, () => {
                    Router.push(`/um?language=${language}`);
                });
            } else {
                this.setState({ isUM: false });
            }
        });
    };

    async onSubmit(event: any) {
        event && event.preventDefault();

        const { username, password, language } = this.state;
        if (!username) {
            alert("Username are required");
            return;
        }

        setStorage(LocalStorageKeys.username, this.state.username);

        const encodeKey = crypto.randomBytes(20).toString("hex");
        const request = {
            Username: username,
            EncodeKey: encodeKey,
            EncryptedPassword: await encrypt(encodePwd(password, encodeKey)),
            Language: language,
        };

        Axios.post(`${appSettings.sgConnectApi.url}/Login`, request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((data) => {
                if (data.errorCode) {
                    this.showNotification(this.props.t(`message:${ErrorCodeDictionary[data.errorCode]}`, { errorCode: data.errorCode }));
                } else {
                    location.href = data.redirectUri;
                }
            })
            .catch((error) => {
                this.showNotification(error.toString());
                Sentry.captureException(error);
            });
    }

    render() {
        const { t } = this.props;
        const { username, password, passwordHint, isUM, language, showNotification, notificationContent, isKeyboardOpen } = this.state;
        if (isUM) {
            return null;
        }
        return (
            <div className={Styles.container}>
                {showNotification && <NotificationPopup onCloseModal={this.hideNotification.bind(this)} content={notificationContent} />}
                <div className={Styles.header}>
                    <LanguageSelector langCode={language} onUpdateLanguage={this.updateLanguage.bind(this)} />
                </div>
                <div className={Styles.logo}>
                    <img src="/images/login/logo.png?v=2" alt="logo" />
                </div>

                <form
                    id="login-form"
                    className={`${Styles["login-form"]} ${isKeyboardOpen ? Styles["show-keyboard"] : ""}`}
                    onSubmit={this.onSubmit.bind(this)}
                >
                    <p className={Styles.description}>{t("description")}</p>
                    <div className={Styles["form-action"]}>
                        <div className={Styles["input-group"]}>
                            <span className={Styles["icon"]}>
                                <img className="" src={`/images/login/username-icon.png`} />
                            </span>
                            <input
                                className={Styles["form-control"]}
                                type="text"
                                value={username}
                                placeholder={t("username")}
                                id="username"
                                onChange={this.onInputUsernameChange.bind(this)}
                            />
                        </div>
                        <div className={Styles["input-group"]}>
                            <span className={Styles["icon"]}>
                                <img src={`/images/login/password-icon.png`} />
                            </span>
                            <input
                                className={Styles["form-control"]}
                                type={passwordHint ? "text" : "password"}
                                value={password}
                                placeholder={t("password")}
                                onChange={this.onInputPasswordChange.bind(this)}
                                id="password"
                            />
                            <button type="button" className={Styles["icon-view"]} onClick={this.updatePasswordHint.bind(this)}>
                                <img src={`/images/login/icon-eye${passwordHint ? "-slash" : ""}.png`} />
                            </button>
                        </div>

                        <button className={Styles["login-btn"]} type="submit" disabled={password == "" || username == ""}>
                            {t("login")}
                            {(password == "" || username == "") && <div className={Styles["overlay"]}></div>}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withTranslation(["login", "message"])(Login);
