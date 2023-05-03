import { BasicValueSource } from "./commonHandles.js"

export default {
    Variable: {
        id: "Variable",
        name: "Variable",
        description: "Basic variable.",
        categories: [],
        targets: {
            values: {
                initial: {}
            },
            signals: {
                set: {
                    action(newValue) {
                        this.state.$ = newValue
                    }
                }
            }
        },
        sources: {
            values: {
                current: BasicValueSource()
            }
        },
        setup() {
            this.state.$ = this.initial
        },
    }
}