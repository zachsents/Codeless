import { ScrollArea } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import DataViewer from "../DataViewer"


export const DataViewerModalName = "DataViewer"

// eslint-disable-next-line no-unused-vars
export function DataViewerModal({ context, id, innerProps: {
    data,
} }) {

    return <DataViewer data={data} topLevel />
}

export function openDataViewer(data, props = {}) {
    openContextModal({
        modal: DataViewerModalName,
        innerProps: {
            data,
        },
        title: "Viewing Data",
        centered: true,
        size: "lg",
        transitionProps: {
            duration: 100,
        },
        zIndex: 300,
        scrollAreaComponent: ScrollArea.Autosize,
        ...props,
    })
}

