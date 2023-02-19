import { SiGooglesheets } from "react-icons/si"
import { GoogleSheetsAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components"


export default {
    id: "integration:GoogleSheets",
    name: "Google Sheets",
    icon: SiGooglesheets,
    color: "green",

    manager: GoogleSheetsAuthManager,
    
    render: props => <OAuthIntegration manager={GoogleSheetsAuthManager} {...props} />,
}