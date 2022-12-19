
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

        const doMath = function() {
            this.publish({
                result: base?.map(b => Math.pow(b, power))
            })
        }

        setTimeout(doMath.bind(this), 1000)
    },
}