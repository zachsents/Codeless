import { TableField } from "./TableField.js"
import { Operation } from "./Operation"


// create random test data
const testData = Array(100).fill(0).map((_, i) => ({
    row: i + 1,
    a: Math.floor(Math.random() * 100),
    b: Math.floor(Math.random() * 10),
    c: `i am a ${Math.random() < 0.5 ? "dog" : "cat"}`[Math.random() < 0.5 ? "toUpperCase" : "toLowerCase"](),
}))


// create comparison data with regular Array functions
const CorrectFilters = {
    aIsLessThan50: x => x.a < 50,
    bEquals8: x => x.b == 8,
    bIsEven: x => x.b % 2 == 0,
    cContainsCatInsensitive: x => /cat/i.test(x.c)
}


// create test conditions
const aIsLessThan50 = Operation.LessThan(new TableField("a"), 50)
const bEquals8 = Operation.Equals(new TableField("b"), 8)
const bIsEven = new Operation("is-even", x => x % 2 == 0, new TableField("b"))
const cContainsCatInsensitive = Operation.MatchesRegex(new TableField("c"), /cat/i)


test("a < 50", () => {
    expect(filterOperation(
        aIsLessThan50
    )).toEqual(
        testData
            .filter(CorrectFilters.aIsLessThan50)
    )
})


test("b == 8", () => {
    expect(filterOperation(
        bEquals8
    )).toEqual(
        testData
            .filter(CorrectFilters.bEquals8)
    )
})


test("a < 50 && b is even", () => {
    expect(filterOperation(
        aIsLessThan50.and(bIsEven)
    )).toEqual(
        testData
            .filter(CorrectFilters.aIsLessThan50)
            .filter(CorrectFilters.bIsEven)
    )
})


test("a < 50 && b is even && is a cat", () => {
    expect(filterOperation(
        aIsLessThan50.and(bIsEven).and(cContainsCatInsensitive)
    )).toEqual(
        testData
            .filter(CorrectFilters.aIsLessThan50)
            .filter(CorrectFilters.bIsEven)
            .filter(CorrectFilters.cContainsCatInsensitive)
    )
})


test("(a < 50 || b == 8) && is a cat", () => {
    expect(filterOperation(
        aIsLessThan50.or(bEquals8).and(cContainsCatInsensitive)
    )).toEqual(
        testData
            .filter(x => CorrectFilters.aIsLessThan50(x) || CorrectFilters.bEquals8(x))
            .filter(CorrectFilters.cContainsCatInsensitive)
    )
})


test("(a + b - 3) * b", () => {
    expect(mapOperation(
        Operation.Add(new TableField("a"), new TableField("b"))
        |> Operation.Subtract(^^, 3)
        |> Operation.Multiply(^^, new TableField("b"))
    )).toEqual(
        testData
            .map(x => (x.a + x.b - 3) * x.b)
    )
})


function mapOperation(op) {
    return testData.map(
        row => op.substitute(TableField, tf => row[tf.field]).valueOf()
    )
}


function filterOperation(op) {
    return testData.filter(
        row => op.substitute(TableField, tf => row[tf.field]).valueOf()
    )
}


/**
 * WILO: Converted Condition to be nested and its methods to be recursive to make
 * nested conditional nodes work better. Next, we just need clean out the extra methods
 * left in that class, then convert the filter compilation for both Google Sheets and
 * Airtable. We probably don't even need to wrap primitives, as we'll be wrapping all
 * the filters in a Condition.And call. Nice and easy.
 * 
 * Also added Babel and ESLint to the Server SDK project. This is allowing me to use
 * pipeline operators (which are sick) with proper linting and validation. I also threw
 * TS into the mix, but it's a headache as always. That's a can of worms we don't need
 * to open right now.
 */