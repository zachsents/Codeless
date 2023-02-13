import { SiGooglesheets } from "react-icons/si"
import { GoogleSheetsIntegration } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components"


export default {
    title: "Google Sheets",
    icon: SiGooglesheets,
    color: "teal.5",
    component: props => <OAuthIntegration integration={GoogleSheetsIntegration} {...props} />,
}
