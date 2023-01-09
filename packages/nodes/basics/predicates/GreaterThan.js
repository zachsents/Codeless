import { BasicPredicate } from "./templates.js"


export default {
    id: "basic:GreaterThan",
    name: "Greater Than",

    ...BasicPredicate((a, b) => a > b),
}