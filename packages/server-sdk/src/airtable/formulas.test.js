import { TableField } from "../types/TableField.js"
import { Operation } from "../types/Operation.js"
import { AirtableFormula } from "./formulas.js"

const toString = cond => cond.toString(AirtableFormula.ParamMappings, AirtableFormula.OperationMappings)

// create test conditions
const aIsLessThan50 = Operation.LessThan(new TableField("a"), 50)
const bEquals8 = Operation.Equals(new TableField("b"), 8)
const cContainsCatInsensitive = Operation.MatchesRegex(new TableField("c"), /cat/i)
const math = Operation.Add(new TableField("a"), new TableField("b"))
    |> Operation.Subtract(^^, 3)
    |> Operation.Multiply(^^, new TableField("b"))


test("a < 50", () => {
    toString(aIsLessThan50)
        |> expect(^^).toBe("({a} < 50)")
})


test("b == 8", () => {
    toString(bEquals8)
        |> expect(^^).toBe("({b} = 8)")
})


test("a < 50 && b is even", () => {
    toString(aIsLessThan50.and(bEquals8))
        |> expect(^^).toBe("AND(({a} < 50), ({b} = 8))")
})


test("a < 50 && b is even && is a cat", () => {
    toString(aIsLessThan50.and(bEquals8, cContainsCatInsensitive))
        |> expect(^^).toBe("AND(({a} < 50), ({b} = 8), REGEX_MATCH({c}, \"cat\"))")
})


test("a < 50 && b is even && is a cat (nested)", () => {
    return toString(aIsLessThan50.and(bEquals8).and(cContainsCatInsensitive))
        |> expect(^^).toBe("AND(AND(({a} < 50), ({b} = 8)), REGEX_MATCH({c}, \"cat\"))")
})


test("(a < 50 || b == 8) && is a cat", () => {
    toString(aIsLessThan50.or(bEquals8).and(cContainsCatInsensitive))
        |> expect(^^).toBe("AND(OR(({a} < 50), ({b} = 8)), REGEX_MATCH({c}, \"cat\"))")
})


test("Math", () => {
    toString(math)
        |> expect(^^).toBe("((({a} + {b}) - 3) * {b})")
})

