import { BrandAirtable } from "tabler-icons-react"
import { AirTableAuthManager } from "@minus/client-sdk"
import { OAuthIntegration } from "../components/index"


const id = "integration:AirTable"

export default {
    id,
    name: "AirTable",
    icon: BrandAirtable,
    color: "blue",

    manager: AirTableAuthManager,

    render: props => <OAuthIntegration id={id} manager={AirTableAuthManager} {...props} />,
}
