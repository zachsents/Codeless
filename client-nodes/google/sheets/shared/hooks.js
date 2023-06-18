import { useEffect } from "react"
import { useInputValue, useInternalState, useSelectedIntegrationAccount } from "../../../hooks/nodes"
import { useSpreadsheetDetails } from "@minus/client-sdk/integrations/sheets"
import { useSyncWithNodeState } from "../../../hooks"
import { SHEETS_URL_REGEX } from "./misc"
import { SpreadsheetURLInput } from "./inputs"


export function useSpreadsheetURL() {
    const [, setState] = useInternalState()
    const [spreadsheetUrl] = useInputValue(null, SpreadsheetURLInput.id)

    // Extract Spreadsheet ID when Spreadsheet URL changes
    useEffect(() => {
        const [, spreadsheetId] = spreadsheetUrl?.match(SHEETS_URL_REGEX) ?? []
        setState({ spreadsheetId })
    }, [spreadsheetUrl])
}


/**
 * Hook that gets spreadsheet details from the backend. This hook assumes
 * that the node state contains the `spreadsheetId` property. Use useSpreadsheetURL
 * to extract the spreadsheet ID from the URL.
 *
 * @param {object} options
 * @param {boolean} options.integrationsSatisfied
 * @export
 */
export function useSpreadsheetDetailsInNode({ integrationsSatisfied }) {

    const [state, setState] = useInternalState()

    // Fetch spreadsheet details
    const accountId = useSelectedIntegrationAccount(null, "google")
    const { data: details, isLoading } = useSpreadsheetDetails(integrationsSatisfied && accountId, state.spreadsheetId)

    // Sync details into node state
    useSyncWithNodeState({
        spreadsheetName: details?.name,
        sheets: details?.sheets,
        sheetName: details && !details.sheets.includes(state.sheetName) ? null : state.sheetName,
        isLoading,
    }, setState)
}