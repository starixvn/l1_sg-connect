import appSettings from "@/common/app-settings";
import ErrorCodeDictionary from "@/common/constants/error-code-dictionary";
import { DefaultLanguage, LanguageAPIMapper } from "@/common/constants/language";
import { getUnfinishedUM } from "@/shared/userService";
import * as Sentry from "@sentry/nextjs";
import Axios from "axios";
import Router from "next/router";
import React from "react";
import { isIOS, isMobile } from "react-device-detect";
import { Trans, withTranslation } from "react-i18next";
import LanguageSelector from "./components/language-selector";
import NotificationPopup from "./components/notification-popup";
import { encrypt } from "./helpers/encrypt";
import { getStorage, LocalStorageKeys, setStorage } from "./helpers/local-storage";
import Styles from "./styles.module.scss";
import { IWithGoogleReCaptchaProps, withGoogleReCaptcha } from "react-google-recaptcha-v3";

const MinHeightKeyBoard = 300;

interface Props extends IWithGoogleReCaptchaProps {
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

    isLoading: boolean;

    captchaToken: string;

    refreshReCaptcha: boolean;
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
            language: DefaultLanguage,
            showNotification: false,
            notificationContent: "",
            isKeyboardOpen: false,
            isLoading: false,
            captchaToken: "",
            refreshReCaptcha: false,
        };
    }

    setLoading(isLoading: boolean) {
        this.setState({ isLoading });
    }

    keyboardOpenListener = () => {
        const newState = window.screen.height - MinHeightKeyBoard > (window.visualViewport?.height ?? 0);

        if (this.state.isKeyboardOpen != newState) {
            this.setIsKeyboardOpen(newState);
        }
    };

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

    async componentDidMount() {
        const language = getStorage(LocalStorageKeys.language);
        const username = getStorage(LocalStorageKeys.username);
        this.setState({ language: language ?? DefaultLanguage, username: username ?? "" });

        if (isMobile && typeof visualViewport != "undefined") {
            window.visualViewport?.addEventListener("resize", this.keyboardOpenListener);
        }
        this.getUMInfo();
        this.UMInterval && clearInterval(this.UMInterval);
        this.UMInterval = setInterval(() => {
            this.getUMInfo();
        }, 1000 * 60); // 1m
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

    async login(token: string) {
        const { username, password, language } = this.state;

        const encryptPassword = {
            timestamp: new Date().toUTCString(),
            username,
            password,
        };

        const request = {
            username,
            encryptedPassword: await encrypt(JSON.stringify(encryptPassword)),
            language: LanguageAPIMapper[language],
            token,
        };

        Axios.post("/api/login", request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((data) => {
                if (data.errorCode) {
                    const messageKey = ErrorCodeDictionary[data.errorCode] ?? "errorOccurred";
                    this.showNotification(this.props.t(`message:${messageKey}`, { errorCode: data.errorCode }));
                    this.setLoading(false);
                } else {
                    setStorage(LocalStorageKeys.username, this.state.username);
                    location.href = data.redirectUri;
                }
            })
            .catch((error) => {
                this.showNotification(this.props.t(`message:unknownErrorOccurred`));
                Sentry.captureException(error);
                this.setLoading(false);
            });
    }

    async onSubmit(event: any) {
        event && event.preventDefault();
        const { isLoading } = this.state;

        if (!isLoading) {
            this.setLoading(true);
            const token = await this.handleVerifyRecaptcha();

            this.login(token || "");
        }
    }

    onFocus(event: any) {
        if (isIOS) {
            event.preventDefault();
            event.target.focus({ preventScroll: true });

            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }, 150);
        }
    }

    handleVerifyRecaptcha = async () => {
        const { executeRecaptcha } = this.props.googleReCaptchaProps;

        if (!executeRecaptcha) {
            console.log("Recaptcha has not been loaded");

            return;
        }

        const token = await executeRecaptcha("login");

        return token;
    };

    render() {
        const { t } = this.props;
        const { username, password, passwordHint, isUM, language, showNotification, notificationContent, isKeyboardOpen, isLoading } =
            this.state;
        if (isUM) {
            return null;
        }

        return (
            <div className={Styles.container}>
                <div className={`${Styles["top-area"]} ${isKeyboardOpen ? Styles["show-keyboard"] : ""}`}>
                    {showNotification && (
                        <NotificationPopup onCloseModal={this.hideNotification.bind(this)} content={notificationContent} />
                    )}
                    <div className={Styles.header}>
                        <LanguageSelector langCode={language} onUpdateLanguage={this.updateLanguage.bind(this)} />
                    </div>
                    <div className={Styles.logo}>
                        <img src="/images/login/logo.png?v=2" alt="logo" />
                    </div>
                </div>

                <form
                    id="login-form"
                    className={`${Styles["login-form"]} ${isKeyboardOpen ? Styles["show-keyboard"] : ""}`}
                    onSubmit={this.onSubmit.bind(this)}
                >
                    <Trans>
                        <p className={`${Styles.description} ${isKeyboardOpen ? Styles["keyboard-open"] : ""}`}>{t("description")}</p>
                    </Trans>
                    <div className={Styles["form-action"]}>
                        <div className={Styles["input-group"]}>
                            <div className={Styles["icon"]}>
                                <span className="icon-user"></span>
                            </div>
                            <input
                                className={Styles["form-control"]}
                                type="text"
                                value={username}
                                placeholder={t("username")}
                                id="username"
                                onChange={this.onInputUsernameChange.bind(this)}
                                onTouchEnd={this.onFocus.bind(this)}
                            />
                        </div>
                        <div className={Styles["input-group"]}>
                            <div className={Styles["icon"]}>
                                <span className="icon-password"></span>
                            </div>
                            <input
                                className={Styles["form-control"]}
                                type={passwordHint ? "text" : "password"}
                                value={password}
                                placeholder={t("password")}
                                onChange={this.onInputPasswordChange.bind(this)}
                                onTouchEnd={this.onFocus.bind(this)}
                                id="password"
                            />
                            <button type="button" className={Styles["icon-view"]} onClick={this.updatePasswordHint.bind(this)}>
                                <span className={`${Styles["icon"]} ${passwordHint ? "icon-eye-slash" : "icon-eye"}`}></span>
                            </button>
                        </div>

                        <button className={Styles["login-btn"]} type="submit" disabled={password == "" || username == "" || isLoading}>
                            {isLoading ? <span className={Styles["loading"]}></span> : t("login")}
                            {(password == "" || username == "" || isLoading) && <div className={Styles["overlay"]}></div>}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withGoogleReCaptcha(withTranslation(["login", "message"])(Login));
