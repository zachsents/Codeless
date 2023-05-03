import { TbBrandGmail } from "react-icons/tb"
import { GmailAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../../components/index"


const id = "integration:Gmail"

export default {
    id,
    name: "Gmail",
    icon: TbBrandGmail,
    color: "red",

    manager: GmailAuthManager,

    render: props => <OAuthIntegration
        id={id}
        manager={GmailAuthManager}
        disconnectLabel="This will disconnect all Google apps."
        {...props}
    />,
}
