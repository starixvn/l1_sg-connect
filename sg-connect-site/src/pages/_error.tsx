import * as Sentry from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
    statusCode: string;
    hasGetInitialPropsRun: boolean;
    err: Object;
}

const MyError = ({ statusCode, hasGetInitialPropsRun, err }: Props) => {
    if (!hasGetInitialPropsRun && err) {
        Sentry.captureException(err);
    }
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }

    return (
        <div className="error-page">
            <img className="error-background small" src={`/images/error.svg`} alt="error" />
            <p className="info">{`An error has occurred, please contact CSD for details.(${statusCode})`}</p>
        </div>
    );
};

MyError.getInitialProps = async (context: NextPageContext) => {
    const initialProps = await NextErrorComponent.getInitialProps(context);

    const errorInitialProps = {
        ...initialProps,
        hasGetInitialPropsRun: true,
    };

    if (initialProps.statusCode != 404) {
        context.err
            ? Sentry.captureException(context.err)
            : Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${context.asPath}`));

        await Sentry.flush(2000);
    }

    return errorInitialProps;
};

export default MyError;
