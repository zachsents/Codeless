

export default {
    id: "utility:Print",
    name: "Print",
    targets: {
        signals: {
            " ": {
                action: x => console.log(x)
            }
        }
    }
}