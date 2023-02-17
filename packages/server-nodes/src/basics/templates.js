
export function Primitive() {
    return {
        inputs: [],
        outputs: ["$"],
    
        onStart() {
            this.publish({ $: this.state.$ })
        },
    }
}