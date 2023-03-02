import React from "react";
import LoginComponent from "@/components/login";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default class Login extends React.Component<{}, {}> {
    render() {
        return <LoginComponent></LoginComponent>;
    }
}

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["login"])),
        },
    };
}
