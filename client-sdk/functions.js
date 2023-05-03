

export function functionUrl(functionName) {
    return `${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/${functionName}`
}