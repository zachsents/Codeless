import { Html, Head, Main, NextScript } from "next/document"
import { additionalCSSVariables } from "@web/theme"


export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />

                {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
                <title>Minus - Automate your business</title>

                <meta
                    property="og:title"
                    content="Minus - Automate your business"
                    key="ogtitle"
                />
                <meta property="og:image" content="/og.png" />
                <meta
                    name="description"
                    content="Build powerful automations without coding"
                    key="description"
                />

                <link rel="icon" href="/favicon.png" key="favicon" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=JetBrains+Mono:wght@300;400;500;600&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />

                <style>
                    {`html { ${additionalCSSVariables} }`}
                </style>
            </Head>
            <body>
                <Main />
                <NextScript />
                {/* <div id="pageLoadOverlay"></div> */}
            </body>
        </Html>
    )
}
