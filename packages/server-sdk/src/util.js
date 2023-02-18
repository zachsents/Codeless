
export function deepFlat(arr) {
    if(arr.some(item => item instanceof Array))
        return deepFlat(arr.flat())
    return arr
}