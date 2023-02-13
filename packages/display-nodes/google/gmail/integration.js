import { TbBrandGmail } from "react-icons/tb"
import { GmailAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components"


export default {
    id: "integration:Gmail",
    name: "Gmail",
    icon: TbBrandGmail,
    color: "red",

    manager: GmailAuthManager,

    render: props => <OAuthIntegration manager={GmailAuthManager} {...props} />,
}
