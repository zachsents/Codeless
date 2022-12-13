

export default {
    id: "utility:Delay",
    name: "Delay",
    targets: {
        values: {
            time: {}
        },
        signals: {
            in: {
                async action(x) {
                    const times = this.state.time == null ? await this.time : [this.state.time]
                    await Promise.all(
                        times.map(
                            time => setAsyncTimeout(() => this.out(x), time * 1000)
                        )
                    )
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

function setAsyncTimeout(func, delay) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            await func?.()
            resolve()
        }, delay)
    })
}