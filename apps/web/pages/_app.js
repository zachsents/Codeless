import { DEFAULT_THEME, MantineProvider } from '@mantine/core'
import { ModalsProvider } from "@mantine/modals"
import RouterTransition from '../components/RouterTransition'
import RenameModal from '../modules/modals'
import '../styles/globals.css'


export default function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
            <ModalsProvider modals={{ rename: RenameModal }}>
                <Component {...pageProps} />
                <RouterTransition />
            </ModalsProvider>
        </MantineProvider>
    )
}


const theme = {
    fontFamily: "DM Sans",
    primaryColor: "indigo",
    headings: {
        fontFamily: "DM Sans",
    },
    defaultRadius: "lg",
    shadows: {
        xs: "",
        sm: "rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 10px 0px",
        md: "rgba(0, 0, 0, 0.05) 0px 3px 2px 0px, rgba(0, 0, 0, 0.1) 0px 7px 20px 0px",
        lg: "rgba(0, 0, 0, 0.05) 0px 5px 4px 0px, rgba(0, 0, 0, 0.1) 0px 10px 30px 0px",
        xl: "rgba(0, 0, 0, 0.05) 0px 20px 40px 0px",
    },
    other: {
        // editorBackgroundColor: DEFAULT_THEME.colors.indigo[1],
        editorBackgroundColor: DEFAULT_THEME.colors.indigo[5],
        // editorBackgroundColor: DEFAULT_THEME.colors.yellow[5],
        // editorBackgroundColor: DEFAULT_THEME.colors.gray[9],
        // editorBackgroundColor: DEFAULT_THEME.colors.gray[2],
    }
    // transitionTimingFunction: "steps(5, end)"
}