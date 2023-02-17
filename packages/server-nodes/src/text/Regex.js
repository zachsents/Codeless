
export default {
    id: "text:Regex",
    name: "Regex",

    inputs: [],
    outputs: ["$"],

    onStart() {
        this.publish({
            $: new RegExp(
                this.state.$,
                Object.entries(this.state.flags)
                    .filter(([, enabled]) => enabled)
                    .map(([flag]) => flag)
                    .join("")
            )
        })
    },
}