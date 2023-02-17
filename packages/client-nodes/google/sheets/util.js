
export function parseRange(text) {
    const [, sheet, start, end] = text?.match?.(/(?:'([^']*)'!)?([A-Za-z0-9]*)(?::([A-Za-z0-9]*))?/) ?? []
    return { sheet, start, end }
}