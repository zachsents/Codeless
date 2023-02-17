import { Condition, TableField } from "../types.js"
import { convertConditionStructureToFormula } from "./formulas.js"


// create random test data
const testData = Array(100).fill(0).map((_, i) => ({
    row: i + 1,
    a: Math.floor(Math.random() * 100),
    b: Math.floor(Math.random() * 10),
    c: `i am a ${Math.random() < 0.5 ? "dog" : "cat"}`[Math.random() < 0.5 ? "toUpperCase" : "toLowerCase"](),
}))

// console.log("Test Data"), console.table(testData), line()


// set up substitution function
const substitute = row => tableField => row[tableField.field]

// make some conditions
const aIsLessThan50 = Condition.LessThan(new TableField("a"), 50)
const bEquals8 = Condition.Equals(new TableField("b"), 8)
const bIsEven = new Condition("is-even", x => x % 2 == 0, new TableField("b"))
const cContainsCatInsensitive = Condition.MatchesRegex(new TableField("c"), /cat/i)
const fixedCondition = Condition.LessThan(50, 75)
const fixedCondition2 = Condition.Equals("cat", "dog")

console.log(
    convertConditionStructureToFormula(aIsLessThan50.and(bEquals8).or(fixedCondition.and(fixedCondition2)).structure)
)