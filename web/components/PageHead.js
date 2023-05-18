import { pageTitle } from "@web/modules/util"
import Head from "next/head"


export default function PageHead({ title }) {

    const fullTitle = pageTitle(title)

    return (
        <Head>
            <title key="title">{fullTitle}</title>
            <meta property="og:title" content={fullTitle} key="ogtitle" />
        </Head>
    )
}
