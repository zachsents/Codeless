import { MantineProvider } from '@mantine/core'
import '../styles/globals.css'


export default function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
            <Component {...pageProps} />
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
    // transitionTimingFunction: "steps(5, end)"
}