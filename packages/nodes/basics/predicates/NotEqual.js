import { BasicPredicate } from "./templates.js"


export default {
    id: "basic:NotEqual",
    name: "Not Equal",

    ...BasicPredicate((a, b) => a != b),
}