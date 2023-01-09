import { BasicPredicate } from "./templates.js"


export default {
    id: "basic:Or",
    name: "Or",

    ...BasicPredicate((a, b) => a || b),
}