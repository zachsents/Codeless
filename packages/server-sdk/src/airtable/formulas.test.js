import { Condition, TableField } from "../types.js"
import { convertConditionStructureToFormula } from "./formulas.js"


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