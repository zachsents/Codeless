

export default {
    id: "utility:ScheduleFlow",
    name: "Schedule Flow",
    targets: {
        values: {
            time: {},
        },
        signals: {
            signal: {
                action: x => x?.length == 1 ? console.log(x[0]) : console.log(x)
            },
        }
    }
}