import { RunStatus } from "@minus/client-sdk"
import { TbActivity, TbAlertTriangle, TbCheck, TbClock, TbExclamationMark } from "react-icons/tb"

export function formatRunStatus(status) {
    return status
        .replaceAll("-", " ")
        .replaceAll(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
}


export function shortRunId(runId) {
    return runId.slice(0, 3).toUpperCase()
}


const _runStatusIcon = {
    [RunStatus.Finished]: TbCheck,
    [RunStatus.FinishedWithErrors]: TbAlertTriangle,
    [RunStatus.Failed]: TbExclamationMark,
    [RunStatus.FailedValidation]: TbExclamationMark,
    [RunStatus.Pending]: TbActivity,
    [RunStatus.Scheduled]: TbClock,
}

export function RunStatusIcon({ status, ...props }) {
    const Icon = _runStatusIcon[status]
    return <Icon {...props} />
}

const _runStatusColor = {
    [RunStatus.Finished]: "green",
    [RunStatus.FinishedWithErrors]: "yellow",
    [RunStatus.Failed]: "red",
    [RunStatus.FailedValidation]: "red",
    [RunStatus.Pending]: false,
    [RunStatus.Scheduled]: "blue",
}

export function runStatusColor(status) {
    return _runStatusColor[status] ?? "gray"
}