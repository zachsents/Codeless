import AppDashboard from "../../../components/AppDashboard"
import { useMustBeSignedIn } from "../../../modules/hooks"


export default function AppSettings() {

    useMustBeSignedIn()

    return (
        <AppDashboard>

        </AppDashboard>
    )
}
