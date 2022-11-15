
export default {
    Log: {
        id: "Log",
        name: "Log",
        description: "Prints to console.",
        categories: ["Debug"],
        targets: {
            signals: {
                " ": {
                    action: x => x?.length == 1 ? console.log(x[0]) : console.log(x)
                }
            }
        }
    }
}