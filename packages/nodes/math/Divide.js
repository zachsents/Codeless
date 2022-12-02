
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
                    const numList = await this.numerator
                    const denomList = await this.denominator

                    console.log(numList)
                    console.log(denomList)

                    return denomList.length == 1 ?
                        numList.map(num => num / denomList[0]) :
                        numList.map((num, i) => num / denomList[i])
                }
            }
        }
    },
}