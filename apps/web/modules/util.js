export function plural(count) {
    if (count > 1)
        return "s"
}


export function objectOrFunction(item, ...args) {
    return typeof item == "function" ? item(...args) : item
}
