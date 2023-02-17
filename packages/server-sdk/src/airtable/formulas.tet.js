import { TableField } from "../types.js"
import { Operation } from "../types/Operation"
import { convertConditionStructureToFormula } from "./formulas.js"


// make some conditions
// const aIsLessThan50 = Operation.LessThan(new TableField("a"), 50)
// const bEquals8 = Operation.Equals(new TableField("b"), 8)
// const bIsEven = new Operation("is-even", x => x % 2 == 0, new TableField("b"))
// const cContainsCatInsensitive = Operation.MatchesRegex(new TableField("c"), /cat/i)
// const fixedCondition = Operation.LessThan(50, 75)
// const fixedCondition2 = Operation.Equals("cat", "dog")

// console.log(
//     convertConditionStructureToFormula(aIsLessThan50.and(bEquals8).or(fixedCondition.and(fixedCondition2)).structure)
// )