import { TbBrandGmail } from "react-icons/tb"
import GoogleAuth from "../GoogleAuth"


export default {
    title: "Gmail",
    icon: TbBrandGmail,
    color: "red",
    component: props => <GoogleAuth {...props} requiredScopes={["https://www.googleapis.com/auth/gmail.modify"]} />,
}
