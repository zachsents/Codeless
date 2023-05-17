

export function createLinearGradient(colorObject, center, {
    shade = 5,
    removeGrays = true,
    angle = 45,
} = {}) {

    if (center === null)
        return colorObject.gray?.[shade] ?? "gray"

    const colors = removeGrays ? justMantineColors(colorObject) : colorObject
    const colorKeys = Object.keys(colors)
    const centerIndex = colorKeys.indexOf(center)

    const prevIndex = (colorKeys.length + centerIndex - 1) % colorKeys.length
    const nextIndex = (centerIndex + 1) % colorKeys.length

    return `linear-gradient(${angle}deg, ${colors[colorKeys[prevIndex]][shade]
        } 0%, ${colors[center][shade]
        } 50%, ${colors[colorKeys[nextIndex]][shade]
        } 100%)`
}


export function justMantineColors(colors) {
    const newColors = { ...colors }
    delete newColors["gray"]
    delete newColors["dark"]
    return newColors
}