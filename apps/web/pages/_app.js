import { MantineProvider } from '@mantine/core'
import '../styles/globals.css'

const theme = {
    fontFamily: "DM Sans",
    primaryColor: "indigo",
    headings: {
        fontFamily: "DM Sans",
    },
}

function MyApp({ Component, pageProps }) {
    return (
        <MantineProvider theme={theme} withNormalizeCSS withGlobalStyles>
            <Component {...pageProps} />
        </MantineProvider>
    )
}

export default MyApp
