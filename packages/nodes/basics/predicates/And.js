import { BasicPredicate } from "./templates.js"


export default {
    id: "basic:And",
    name: "And",

    ...BasicPredicate((a, b) => a && b),
}