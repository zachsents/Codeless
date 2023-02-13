import { BrandAirtable } from "tabler-icons-react"
import { AirTableIntegration } from "@minus/client-sdk"
import { OAuthIntegration } from "../components"


export default {
    title: "AirTable",
    icon: BrandAirtable,
    color: "yellow",
    component: props => <OAuthIntegration integration={AirTableIntegration} {...props} />,
}
