
const ParamMappings = {
    // Primitives
    "boolean": x => x ? "TRUE()" : "FALSE()",
    "number": x => `${x}`,
    "string": x => `"${x}"`,

    // Generic Types
    "RegExp": x => `"${x.source}"`,

    // Our Types
    "TableField": x => `{${x.field}}`,
}

const OperationMappings = {
    // Primitives
    "true": () => "TRUE()",
    "false": () => "FALSE()",

    // Comparison
    "equals": (a, b) => `(${a} = ${b})`,
    "not-equal": (a, b) => `(${a} != ${b})`,
    "greater-than": (a, b) => `(${a} > ${b})`,
    "greater-than-or-equal": (a, b) => `(${a} >= ${b})`,
    "less-than": (a, b) => `(${a} < ${b})`,
    "less-than-or-equal": (a, b) => `(${a} <= ${b})`,

    // Logical
    "not": (a) => `NOT(${a})`,
    "and": (...args) => `AND(${args.join(", ")})`,
    "or": (...args) => `OR(${args.join(", ")})`,

    // Strings
    "contains": (a, b) => `REGEX_MATCH(${a}, ${b})`,
    "matches-regex": (a, b) => `REGEX_MATCH(${a}, ${b})`,

    // Match
    "add": (...args) => `(${args.join(" + ")})`,
    "subtract": (...args) => `(${args.join(" - ")})`,
    "multiply": (...args) => `(${args.join(" * ")})`,
    "divide": (...args) => `(${args.join(" / ")})`,
    "power": (a, b) => `POWER(${a}, ${b})`,
}


export const AirtableFormula = {
    ParamMappings,
    OperationMappings,
}