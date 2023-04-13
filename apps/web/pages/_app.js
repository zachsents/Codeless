import Head from "next/head"
import { MantineProvider, DEFAULT_THEME } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClientProvider, QueryClient } from "react-query"

import "../styles/globals.css"

import RenameFlowModal from "../components/modals/RenameFlowModal"
import DeleteFlowModal from "../components/modals/DeleteFlowModal"
import CreateAppModal from "../components/modals/CreateAppModal"
import DeleteAppModal from "../components/modals/DeleteAppModal"
import RouterTransition from "../components/RouterTransition"
import ScheduleFlowModal from "../components/modals/ScheduleFlowModal"
import NodePalette from "../components/flow-editor/NodePalette"

import { initializeFirebase } from "@minus/client-sdk"
initializeFirebase()


const queryClient = new QueryClient()


export default function MyApp({ Component, pageProps }) {
    return (<>
        <Head>
            <title key="title">Minus</title>
            <meta property="og:title" content="Minus" key="ogtitle" />
            <meta name="description" content="Build automations with ease" key="description" />
            <link rel="icon" href="/favicon.png" key="favicon" />
            <style>
                {`html { ${additionalCSSVariables} }`}
            </style>
        </Head>
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles withCSSVariables>
                <ModalsProvider modals={modals}>
                    <Component {...pageProps} />
                    <RouterTransition />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    </>)
}


const modals = {
    CreateApp: CreateAppModal,
    DeleteApp: DeleteAppModal,
    RenameFlow: RenameFlowModal,
    DeleteFlow: DeleteFlowModal,
    ScheduleFlow: ScheduleFlowModal,
    NodePalette: NodePalette,
}


const theme = {
    fontFamily: "DM Sans",
    primaryColor: "indigo",
    headings: {
        fontFamily: "DM Sans",
    },
    fontSizes: {
        // xs: 12,
    },
    defaultRadius: "md",
    shadows: {
        xs: "",
        sm: "rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 10px 0px",
        md: "rgba(0, 0, 0, 0.05) 0px 3px 2px 0px, rgba(0, 0, 0, 0.1) 0px 7px 20px 0px",
        lg: "rgba(0, 0, 0, 0.05) 0px 5px 4px 0px, rgba(0, 0, 0, 0.1) 0px 10px 30px 0px",
        xl: "rgba(0, 0, 0, 0.05) 0px 20px 40px 0px",
    },
    other: {
        dateTimeFormat: "MMM D, YYYY h:mm A",
    },
    // transitionTimingFunction: "steps(5, end)"
}

const additionalCSSVariables = DEFAULT_THEME.colors.dark.map((_, i) => {
    return `--mantine-color-primary-${i}: ${DEFAULT_THEME.colors[theme.primaryColor][i]};`
}).join(" ")