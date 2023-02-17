

export class Condition {

    static True = new Condition("true", () => true)
    static False = new Condition("false", () => false)
    static Equals = (...params) => new Condition("equals", (a, b) => a == b, ...params)
    static NotEqual = (...params) => new Condition("not-equal", (a, b) => a != b, ...params)
    static Contains = (...params) => new Condition("contains", (a, b) => a.includes(b), ...params)
    static MatchesRegex = (...params) => new Condition("matches-regex", (a, b) => b.test(a), ...params)
    static GreaterThan = (...params) => new Condition("greater-than", (a, b) => a > b, ...params)
    static GreaterThanOrEqualTo = (...params) => new Condition("greater-than-or-equal", (a, b) => a >= b, ...params)
    static LessThan = (...params) => new Condition("less-than", (a, b) => a < b, ...params)
    static LessThanOrEqualTo = (...params) => new Condition("less-than-or-equal", (a, b) => a <= b, ...params)
    static And = (...params) => new Condition("and", (...params) => params.reduce((a, b) => a && b), ...params)
    static Or = (...params) => new Condition("and", (...params) => params.reduce((a, b) => a || b), ...params)


    static wrapPrimitive(condition) {
        return condition instanceof Condition ? condition : (!!condition ? Condition.True : Condition.False)
    }

    static wrapPrimitives(conditions) {
        return conditions.map(Condition.wrapPrimitive)
    }

    /**
     * Creates an instance of Condition.
     * @param {string} subject
     * @param {(x: *) => boolean} compareFunction
     * @memberof Condition
     */
    constructor(name, compareFunction, ...params) {
        this.name = name
        this.compareFunction = compareFunction
        this.params = params
    }

    /**
     * Joins two conditions
     *
     * @param {(a: boolean, b: boolean) => boolean} operation
     * @param {Condition} condition
     * @return {Condition} 
     * @memberof Condition
     */
    join(operation, condition, joinText = "join") {
        return Object.assign(new Condition(), {
            name: `${this.name} ${joinText} ${condition.name}`,
            subjects: [...this.params, ...condition.params],
            compareFunction: (...args) => {
                return operation(
                    this.compareFunction(...args.slice(0, this.params.length)),
                    condition.compareFunction(...args.slice(this.params.length))
                )
            },
            structure: {
                subjects: [this.structure, condition.structure],
                function: joinText,
            },
        })
    }

    and(...conditions) {
        // short circuiting
        if (this == Condition.False || conditions.includes(Condition.False) || conditions.includes(false))
            return Condition.False

        return Condition.And(this, ...conditions)
    }

    or(...conditions) {
        // short circuiting
        if (this == Condition.True || conditions.includes(Condition.True) || conditions.includes(true))
            return Condition.True

        return Condition.Or(this, ...conditions)
    }

    /**
     * Creates a new Condition with the specified type replaced
     * by the value determined by the substitution function. Recurses
     * to nested Conditions.
     *
     * @param {Function} type
     * @param {(param: *) => *} [substiutionFunction=x => x]
     * @return {Condition} 
     * @memberof Condition
     */
    substitute(type, substiutionFunction = x => x) {
        return Object.assign(new Condition(), this, {
            params: this.params.map(param => {
                // 1st - substitute specified type
                if (param instanceof type)
                    return substiutionFunction(param)

                // 2nd - recurse other Conditions
                if (param instanceof Condition)
                    return param.substitute(type, substiutionFunction)

                // fallback - return straight up
                return param
            })
        })
    }

    /**
     * Recursively evaluates Conditions.
     * @return {boolean}
     */
    valueOf() {
        return this.params.map(param => param.valueOf())
            |> this.compareFunction(...^^)
    }
}


export class Sentinel { }


export class TableField extends Sentinel {
    constructor(field) {
        super()
        this.field = field
    }
}
