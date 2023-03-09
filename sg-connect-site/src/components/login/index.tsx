import Axios from "axios";
import React from "react";
import Styles from "./styles.module.scss";
import { LocalStorageKeys, getStorage, setStorage } from "./helpers/local-storage";
import { encodePwd } from "./helpers/encode";
import crypto from "crypto";
import appSettings from "@/common/app-settings";
import { getUnfinishedUM } from "@/shared/userService";
import * as Sentry from "@sentry/nextjs";
import { withTranslation } from "react-i18next";
import Router from "next/router";
import LanguageSelector from "./components/language-selector";
import NotificationPopup from "./components/notification-popup";

interface Props {
    t: Function;
}

interface State {
    username: string;
    password: string;
    rememberMe: boolean;
    passwordHint: boolean;
    isUM: boolean;
    language: string;

    showNotification: boolean;

    notificationContent: string;
}

class Login extends React.Component<Props, State> {
    private UMInterval: any;

    constructor(props: any) {
        super(props);

        this.state = {
            username: "",
            password: "",
            rememberMe: false,
            passwordHint: false,
            isUM: true,
            language: "en-US",
            showNotification: false,
            notificationContent: "",
        };
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

    clickRememberHandle() {
        this.setState({ rememberMe: !this.state.rememberMe });
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
    }

    async componentDidMount() {
        this.getUMInfo();
        this.UMInterval = setInterval(() => this.getUMInfo(), 1000 * 60); // 1m
    }

    componentWillUnmount(): void {
        this.UMInterval && clearInterval(this.UMInterval);
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

        const { username, password } = this.state;
        if (!username) {
            alert("Username are required");
            return;
        }

        if (this.state.rememberMe) {
            setStorage(LocalStorageKeys.username, this.state.username);
            setStorage(LocalStorageKeys.rememberMe, true);
        } else {
            setStorage(LocalStorageKeys.username, "");
            setStorage(LocalStorageKeys.rememberMe, false);
        }

        const encodeKey = crypto.randomBytes(20).toString("hex");

        const request = {
            Username: username,
            EncodeKey: encodeKey,
            Password: encodePwd(password, encodeKey),
            Language: "en-US",
        };

        Axios.post(`${appSettings.sgConnectApi.url}/Login`, request)
            .then((data) => data.data)
            .then((data) => (data.error ? Promise.reject(data.error) : data))
            .then((data) => {
                location.href = data.redirectUri;
            })
            .catch((error) => {
                this.showNotification(error.toString());
                Sentry.captureException(error);
            });
    }

    render() {
        const { t } = this.props;
        const { username, password, rememberMe, passwordHint, isUM, language, showNotification, notificationContent } = this.state;
        if (isUM) {
            return null;
        }
        return (
            <div
                className={`d-flex flex-column ${Styles.container}`}
                style={{
                    backgroundImage: `url("/images/login/background.jpg")`,
                    backgroundSize: "100%",
                    height: "100%",
                }}
            >
                {showNotification && <NotificationPopup onCloseModal={this.hideNotification.bind(this)} content={notificationContent} />}
                <div className={Styles.header}>
                    <div className={Styles.actions}>
                        <LanguageSelector langCode={language} onUpdateLanguage={this.updateLanguage.bind(this)} />
                    </div>
                </div>
                <div className={`${Styles.logo}`}>
                    <img src="/images/login/logo.png" alt="logo" />
                </div>

                <div className={`d-plex p-2 ${Styles["actions"]}`}>
                    <form id="login-form" className={Styles["login-form"]} onSubmit={this.onSubmit.bind(this)}>
                        <p className={Styles.description}>{t("description")}</p>
                        <div className={Styles["form-action"]}>
                            <div className="form-group">
                                <div className={`input-group ${Styles["input"]}`}>
                                    <span className={`input-group-text ${Styles["icon"]}`}>
                                        <img className="" src={`/images/login/username-icon.png`}></img>
                                    </span>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={username}
                                        placeholder={t("username")}
                                        id="username"
                                        onChange={this.onInputUsernameChange.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className={`input-group ${Styles["input"]}`}>
                                    <span className={`input-group-text ${Styles["icon"]}`}>
                                        <img src={`/images/login/password-icon.png`}></img>
                                    </span>
                                    <input
                                        className="form-control"
                                        type={passwordHint ? "text" : "password"}
                                        value={password}
                                        placeholder={t("password")}
                                        onChange={this.onInputPasswordChange.bind(this)}
                                        id="password"
                                    />
                                    <button
                                        type="button"
                                        className={`input-group-text ${Styles["icon"]}`}
                                        onClick={this.updatePasswordHint.bind(this)}
                                    >
                                        <img src={`/images/login/password-append-icon.png`}></img>
                                    </button>
                                </div>
                            </div>
                            <div className={`container ${Styles["remember-btn"]}`}>
                                <input
                                    className={Styles["checkbox"]}
                                    type="checkbox"
                                    id="rememberMe"
                                    value="rememberMe"
                                    onChange={this.clickRememberHandle.bind(this)}
                                    checked={rememberMe}
                                ></input>
                                <label htmlFor="rememberMe">
                                    <span className={`${Styles["checkmark"]} ${rememberMe ? Styles["checked"] : null}`}></span>
                                    {t("rememberMe")}
                                </label>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <button className={Styles["signin-btn"]} type="submit" disabled={password == "" || username == ""}>
                                    {t("signIn")}
                                    {(password == "" || username == "") && <div className={Styles["overlay"]}></div>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className={`p-2 ${Styles.footer}`}>Version 1.124</div>
            </div>
        );
    }
}

export default withTranslation("login")(Login);
