import { SiGooglesheets } from "react-icons/si"
import GoogleAuth from "../GoogleAuth"


export default {
    title: "Google Sheets",
    icon: SiGooglesheets,
    color: "teal.5",
    component: props => <GoogleAuth {...props} requiredScopes={["https://www.googleapis.com/auth/spreadsheets"]} />,
}
