import { SiGooglesheets } from "react-icons/si"

// eslint-disable-next-line no-unused-vars
export const SheetsIcon = ({ strokeWidth, ...props }) => <SiGooglesheets {...props} /> // block strokeWidth prop for this icon


export const SHEETS_URL_REGEX = /d\/([0-9A-Za-z_-]{40,})\/edit/


export function parseRange(text) {
    const [, sheet, start, end] = text?.match?.(/(?:'([^']*)'!)?([A-Za-z0-9]*)(?::([A-Za-z0-9]*))?/) ?? []
    return { sheet, start, end }
}