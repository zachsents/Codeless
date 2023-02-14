import { BrandAirtable } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components"


export default {
    id: "airtable:UseTable",
    name: "Use Table",
    description: "Configures a base and table from AirTable.",
    icon: BrandAirtable,
    color: "yellow",
    badge: "airtable",

    inputs: [],
    outputs: ["table"],


    renderNode: ({ state, setState }) => {
        return (
            <></>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="">
                        Base ID
                    </ControlLabel>
                </Control>

                <Control>
                    <ControlLabel info="">
                        Table ID
                    </ControlLabel>
                </Control>
            </ControlStack>
        )
    },

}