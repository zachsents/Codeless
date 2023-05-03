import { SiGooglesheets } from "react-icons/si"
import { GoogleSheetsAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components/index"


const id = "integration:GoogleSheets"

export default {
    id,
    name: "Google Sheets",
    icon: SiGooglesheets,
    color: "green",

    manager: GoogleSheetsAuthManager,

    render: props => <OAuthIntegration
        id={id}
        manager={GoogleSheetsAuthManager}
        disconnectLabel="This will disconnect all Google apps."
        {...props}
    />,
}
