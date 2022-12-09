

export default {
    id: "utility:Delay",
    name: "Delay",
    targets: {
        values: {
            time: {}
        },
        signals: {
            in: {
                async action() {
                    const times = this.state.time == null ? await this.time : [this.state.time]
                    times.forEach(time => {
                        setTimeout(() => {
                            this.out()
                        }, time * 1000)
                    })
                }
            }
        }
    },
    sources: {
        signals: {
            out: {}
        }
    },
}