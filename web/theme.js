import { DEFAULT_THEME } from "@mantine/core"

const ContentWidth = 60 //rem

/** @type {import("@mantine/core").MantineThemeOverride} */
export const mantineTheme = {
    fontFamily: "DM Sans",
    primaryColor: "violet",
    headings: {
        fontFamily: "DM Sans",
    },
    fontSizes: {
        // xs: 12,
    },
    defaultRadius: "md",
    shadows: {
        xs: "rgba(0, 0, 0, 0.1) 0px 2px 5px 0px",
        sm: "rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 10px 0px",
        md: "rgba(0, 0, 0, 0.05) 0px 3px 2px 0px, rgba(0, 0, 0, 0.1) 0px 7px 20px 0px",
        lg: "rgba(0, 0, 0, 0.05) 0px 5px 4px 0px, rgba(0, 0, 0, 0.1) 0px 10px 30px 0px",
        xl: "rgba(0, 0, 0, 0.05) 0px 20px 40px 0px",
    },
    other: {
        dateTimeFormat: "MMM D, YYYY h:mm A",
        contentWidth: `${ContentWidth}rem`,
        halfDimmed: "dark.3",
        halfDimmedHex: DEFAULT_THEME.colors.dark[3],
    },
    components: {
        Container: {
            defaultProps: {
                sizes: {
                    xs: `${ContentWidth * 0.75 * 0.75}rem`,
                    sm: `${ContentWidth * 0.75}rem`,
                    md: `${ContentWidth}rem`,
                    lg: `${ContentWidth * 1.15}rem`,
                    xl: `${ContentWidth * 1.15 * 1.15}rem`,
                },
                p: 0,
            },
        },
    },
    // transitionTimingFunction: "steps(5, end)"
}

export const tailwindTheme = {
    // Tailwind takes colors in the form of:
    // red: {
    //     100: "#f7f3f3",
    //     200: "#e5d4d4",
    //     ...
    colors: {
        ...Object.fromEntries(
            Object.entries(DEFAULT_THEME.colors).map(([color, colorSet]) => [
                color,
                colorArrayToTailwindObject(colorSet)
            ])
        ),
        primary: colorArrayToTailwindObject(DEFAULT_THEME.colors[mantineTheme.primaryColor]),
    },
    borderWidth: {
        "1": "0.0625rem",
    },
    borderRadius: {
        ...DEFAULT_THEME.radius,
        DEFAULT: DEFAULT_THEME.radius.md,
    },
}

// Adds primary colors as CSS variables
export const additionalCSSVariables = DEFAULT_THEME.colors.dark.map((_, i) => {
    return `--mantine-color-primary-${i}: ${DEFAULT_THEME.colors[mantineTheme.primaryColor][i]};`
}).join(" ")


function colorArrayToTailwindObject(arr) {
    return {
        ...Object.fromEntries(
            arr.map((hex, i) => [`${i + 1}00`, hex])
        ),
        DEFAULT: arr[DEFAULT_THEME.primaryShade.light]
    }
}