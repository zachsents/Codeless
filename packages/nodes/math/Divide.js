
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
                async get() {
                    const denom = (await this.denominator)?.[0] ?? 1
                    return (await this.numerator).map(num => num / denom)
                }
            }
        }
    },
}