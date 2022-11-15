
export default {
    Interval: {
        id: "Interval",
        name: "Timer",
        description: "Generates a signal once every specified time period.",
        categories: ["Timing"],
        targets: {
            values: {
                period: {}
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        },
        setup() {
            const period = this.period[0]
            period > 10 && setInterval(() => {
                this[" "]()
            }, period)
        }
    },
    Delay: {
        id: "Delay",
        name: "Delay",
        description: "",
        categories: ["Timing"],
        targets: {
            values: {
                time: {}
            },
            signals: {
                start: {
                    action(x) {
                        setTimeout(() => this[" "](x), this.time[0])
                    }
                }
            }
        },
        sources: {
            signals: {
                " ": {}
            }
        }
    }
}