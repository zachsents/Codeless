import { BasicPredicate } from "./templates.js"


export default {
    id: "basic:Equals",
    name: "Equals",

    ...BasicPredicate((a, b) => a == b),
}