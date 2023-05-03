
export function Primitive() {
    return {
        inputs: [],

        onStart() {
            this.publish({ $: this.state.$ })
        },
    }
}