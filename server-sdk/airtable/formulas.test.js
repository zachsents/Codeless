import { TableField } from "../types/TableField.js"
import { Operation } from "../types/Operation.js"
import { AirtableFormula } from "./formulas.js"

const toString = cond => cond.toString(AirtableFormula.ParamMappings, AirtableFormula.OperationMappings)

// create test conditions
const aIsLessThan50 = Operation.LessThan(new TableField("a"), 50)
const bEquals8 = Operation.Equals(new TableField("b"), 8)
const cContainsCatInsensitive = Operation.MatchesRegex(new TableField("c"), /cat/i)
const math = Operation.Multiply(
    Operation.Subtract(
        Operation.Add(new TableField("a"), new TableField("b")),
        3
    ),
    new TableField("b")
)

test("a < 50", () => {
    expect(toString(aIsLessThan50))
        .toBe("({a} < 50)")
})


test("b == 8", () => {
    expect(toString(bEquals8))
        .toBe("({b} = 8)")
})


test("a < 50 && b is even", () => {
    expect(toString(aIsLessThan50.and(bEquals8)))
        .toBe("AND(({a} < 50), ({b} = 8))")
})


test("a < 50 && b is even && is a cat", () => {
    expect(toString(aIsLessThan50.and(bEquals8, cContainsCatInsensitive)))
        .toBe("AND(({a} < 50), ({b} = 8), REGEX_MATCH({c}, \"cat\"))")
})


test("a < 50 && b is even && is a cat (nested)", () => {
    expect(toString(aIsLessThan50.and(bEquals8).and(cContainsCatInsensitive)))
        .toBe("AND(AND(({a} < 50), ({b} = 8)), REGEX_MATCH({c}, \"cat\"))")
})


test("(a < 50 || b == 8) && is a cat", () => {
    expect(toString(aIsLessThan50.or(bEquals8).and(cContainsCatInsensitive)))
        .toBe("AND(OR(({a} < 50), ({b} = 8)), REGEX_MATCH({c}, \"cat\"))")
})


test("Math", () => {
    expect(toString(math))
        .toBe("((({a} + {b}) - 3) * {b})")
})

