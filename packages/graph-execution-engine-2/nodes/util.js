import { BasicValueSource } from "./commonHandles.js"

export default {
    OnFlowTrigger: {
        id: "OnFlowTrigger",
        name: "Flow Trigger",
        description: "Triggered when this flow begins.",
        categories: [],
        sources: {
            signals: {
                " ": {}
            }
        },
        setup(setupObservable) {
            setupObservable?.subscribe(setupPayload => {
                this[" "](setupPayload)
            })
        }
    },
    Bind: {
        id: "Bind",
        name: "Bind",
        description: "Binds a value to a signal.",
        categories: ["Utility"],
        targets: {
            values: {
                value: {}
            },
            signals: {
                signal: {
                    action() {
                        this.out(this.value)
                    }
                }
            }
        },
        sources: {
            signals: {
                out: {}
            }
        },
    },
    Unbind: {
        id: "Unbind",
        name: "Unbind",
        description: "Separates a signal and the values it contains.",
        categories: ["Utility"],
        targets: {
            signals: {
                signal: {
                    action(x) {
                        this.state.$ = x
                        this.out()
                    }
                }
            },
        },
        sources: {
            values: {
                value: BasicValueSource()
            },
            signals: {
                out: {}
            }
        },
    }
}