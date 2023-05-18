import { useAppContext } from "@web/modules/context"
import PageHead from "../PageHead"


export default function AppPageHead({ title }) {

    const { app } = useAppContext()

    const _title = app?.name ?
        (title ? `${title} - ${app.name}` : app.name) :
        (title || "Loading")

    return <PageHead title={_title} />
}
