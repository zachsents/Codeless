
export function syncType(value, type, truthy, falsy) {
    if ((typeof value === type && value !== null) || (value === null && type == "null"))
        return typeof truthy === "function" ? truthy(value) : truthy

    return typeof falsy === "function" ? falsy(value) : falsy
}