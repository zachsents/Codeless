import { useListHandle } from "@minus/graph-util"
import Control from "./Control"
import ControlLabel from "./ControlLabel"
import MultiInput from "./MultiInput"


export default function ListHandlesControl({
    handleName,
    controlTitle,
    controlInfo,
    addLabel,
    inputPlaceholder,
}) {

    const [labels, setLabels] = useListHandle(null, handleName)

    return (
        <Control>
            <ControlLabel info={controlInfo}>
                {controlTitle}
            </ControlLabel>

            <MultiInput
                items={labels ?? []}
                onChange={setLabels}
                reorder
                inputProps={{
                    placeholder: inputPlaceholder,
                }}
                buttonChildren={addLabel}
            />
        </Control>
    )
}