

const FormulaMappings = {
    "TableField": x => `{${x.field}}`,
    "true": () => "TRUE()",
    "false": () => "FALSE()",
    "string": x => `"${x}"`,
    "number": x => `${x}`,
    "boolean": x => x ? "TRUE()" : "FALSE()",
    "equals": (a, b) => `${a} = ${b}`,
    "not-equal": (a, b) => `${a} != ${b}`,
    "contains": "",
    "matches-regex": "",
    "greater-than": (a, b) => `${a} > ${b}`,
    "greater-than-or-equal": (a, b) => `${a} >= ${b}`,
    "less-than": (a, b) => `${a} < ${b}`,
    "less-than-or-equal": (a, b) => `${a} <= ${b}`,
    "and": (...args) => `AND(${args.join(", ")})`,
    "or": (...args) => `OR(${args.join(", ")})`,
}


export function convertConditionStructureToFormula(structure) {

    if (FormulaMappings[structure?.function])
        return FormulaMappings[structure?.function]?.(...(structure.subjects.map(subj => convertConditionStructureToFormula(subj)) ?? []))

    return (
        FormulaMappings[structure?.constructor?.name] ??
        FormulaMappings[typeof structure]
    )?.(structure)
}