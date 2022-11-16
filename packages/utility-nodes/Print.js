

export default {
    id: "utility:Print",
    name: "Print",
    targets: {
        signals: {
            " ": {
                action: x => x?.length == 1 ? console.log(x[0]) : console.log(x)
            }
        }
    }
}