
export default {
    id: "exampleTransform",
    name: "Example Transform",
    inputs: [
        "base",
        {
            name: "power",
            expectSingleValue: true,
        }
    ],
    outputs: ["result"],

    onInputsReady({ base, power }) {
        const This = this
        
        return new Promise(resolve => {
            setTimeout(() => {
                This.publish({
                    result: base?.map(b => Math.pow(b, power))
                })
                resolve()
            }, 1000)
        })
    },
}