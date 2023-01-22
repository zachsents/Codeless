

export default {
    id: "basic:Template",
    name: "Fill Template",

    inputs: ["$template", "$data"],
    outputs: ["text"],

    async onInputsReady({ $template, $data }) {

        const replacedText = $data.reduce(
            (text, item, i) => {
                const variableName = this.state.dataLabels[i]

                if(!variableName)
                    return text
                
                return text.replaceAll(`{${variableName}}`, item)
            },
            $template
        )

        this.publish({ text: replacedText })
    },
}