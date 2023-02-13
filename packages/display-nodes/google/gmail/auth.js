import { TbBrandGmail } from "react-icons/tb"
import { GmailIntegration } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components"


export default {
    title: "Gmail",
    icon: TbBrandGmail,
    color: "red",
    component: props => <OAuthIntegration integration={GmailIntegration} {...props} />,
}
