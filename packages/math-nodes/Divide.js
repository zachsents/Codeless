
export default {
    id: "math:Divide",
    name: "Divide",
    targets: {
        values: {
            numerator: {},
            denominator: {},
        }
    },
    sources: {
        values: {
            quotient: {
                get() {
                    return this.numerator.map(num => num / (this.denominator?.[0] ?? 1))
                }
            }
        }
    },
}