export function plural(count) {
    if (count > 1)
        return "s"
}


export function objectOrFunction(item, ...args) {
    return typeof item == "function" ? item(...args) : item
}


export function jc(...args) {
    return args.filter(Boolean).join(" ")
}


export function pageTitle(title) {
    return `${title} | Minus`
}

export function stopPropagation(e) {
    e.stopPropagation()
    e.nativeEvent?.preventDefault()
}