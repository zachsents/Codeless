import React from "react"
import AppDashboard from "../../../components/AppDashboard"
import { useMustBeSignedIn } from "../../../modules/hooks"

export default function AppSettings() {

    const user = useMustBeSignedIn()

    return (
        <AppDashboard>

        </AppDashboard>
    )
}
