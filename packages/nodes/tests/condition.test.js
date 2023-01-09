import { Condition } from "../types/index.js"


// If Block -- generates new condition
const cond = new Condition()
//  |
//  |
// Data Block -- adds some data as the subject of the condition
const a = Math.random()
console.log("a:", a)
cond.put(a)
//  |
//  |
// Condition / Predicate Block -- defines the predicate of the condition
cond.setPredicate((sub, obj) => {
    console.log("evaluating predicate")
    return sub > obj
})
//  |
//  |
// Data Block -- adds some data as the object of the condition
const b = Math.random()
console.log("b:", b)
cond.put(b)
//  |
//  |
// Then Block -- evaluates the condition and publishes an execution sentinel if it's true
cond.evaluate() && console.log("✅ Passed -- publish execution sentinel")
//  |
//  |
// Otherwise Block -- evaluates the condition and publishes an execution sentinel if it's false
!cond.evaluate() && console.log("❌ Failed -- publish execution sentinel on otherwise branch")
