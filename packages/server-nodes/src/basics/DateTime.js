

export default {
    id: "basic:DateTime",
    name: "Date & Time",

    inputs: [],
    outputs: ["$"],

    onStart() {
        this.publish({ $: new Date(this.state.$) })
    },
}