import { DEFAULT_THEME, MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClientProvider, QueryClient } from "react-query"

import "../styles/globals.css"

import RenameFlowModal from "../components/modals/RenameFlowModal"
import DeleteFlowModal from "../components/modals/DeleteFlowModal"
import CreateAppModal from "../components/modals/CreateAppModal"
import DeleteAppModal from "../components/modals/DeleteAppModal"
import RouterTransition from "../components/RouterTransition"

import { initializeFirebase } from "@minus/client-sdk"
initializeFirebase(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)


const queryClient = new QueryClient()


export default function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
                <ModalsProvider modals={modals}>
                    <Component {...pageProps} />
                    <RouterTransition />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    )
}


const modals = {
    CreateApp: CreateAppModal,
    DeleteApp: DeleteAppModal,
    RenameFlow: RenameFlowModal,
    DeleteFlow: DeleteFlowModal,
}


const theme = {
    fontFamily: "DM Sans",
    primaryColor: "indigo",
    headings: {
        fontFamily: "DM Sans",
    },
    fontSizes: {
        xs: 12,
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
        // editorBackgroundColor: DEFAULT_THEME.colors.indigo[1],
        // editorBackgroundColor: DEFAULT_THEME.colors.indigo[5],
        // editorBackgroundColor: DEFAULT_THEME.colors.yellow[5],
        // editorBackgroundColor: DEFAULT_THEME.colors.gray[9],
        editorBackgroundColor: DEFAULT_THEME.colors.gray[2],
    }
    // transitionTimingFunction: "steps(5, end)"
}