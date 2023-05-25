import { BrandAirtable } from "tabler-icons-react"
import OAuth2Integration from "../components/OAuth2Integration"


export default {
    id: "airtable",
    name: "Airtable",
    icon: BrandAirtable,
    color: "blue",

    authorizationFunction: "airtable-authorizeApp",
    checkAuthorizationFunction: "airtable-checkAuthorization",

    renderAccount: OAuth2Integration,
}