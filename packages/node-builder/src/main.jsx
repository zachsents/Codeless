import { MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const theme = {
    fontFamily: "JetBrains Mono"
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <App />
        </MantineProvider>
    </React.StrictMode>
)
