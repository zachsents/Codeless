import { BrandAirtable } from "tabler-icons-react"
import { AirTableAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../components"


export default {
    id: "integration:AirTable",
    name: "AirTable",
    icon: BrandAirtable,
    color: "blue",

    manager: AirTableAuthManager,

    render: props => <OAuthIntegration manager={AirTableAuthManager} {...props} />,
}
