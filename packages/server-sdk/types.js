

export class Condition {

    static True = new Condition("true", () => true)
    static False = new Condition("false", () => false)
    static Equals = (...subjects) => new Condition("equals", (a, b) => a == b, ...subjects)
    static NotEqual = (...subjects) => new Condition("not-equal", (a, b) => a != b, ...subjects)
    static Contains = (...subjects) => new Condition("contains", (a, b) => a.includes(b), ...subjects)
    static MatchesRegex = (...subjects) => new Condition("matches-regex", (a, b) => b.test(a), ...subjects)
    static GreaterThan = (...subjects) => new Condition("greater-than", (a, b) => a > b, ...subjects)
    static GreaterThanOrEqualTo = (...subjects) => new Condition("greater-than-or-equal", (a, b) => a >= b, ...subjects)
    static LessThan = (...subjects) => new Condition("less-than", (a, b) => a < b, ...subjects)
    static LessThanOrEqualTo = (...subjects) => new Condition("less-than-or-equal", (a, b) => a <= b, ...subjects)

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
    constructor(name, compareFunction, ...subjects) {
        this.name = name
        this.compareFunction = compareFunction
        this.subjects = subjects
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
            subjects: [...this.subjects, ...condition.subjects],
            compareFunction: (...args) => {
                return operation(
                    this.compareFunction(...args.slice(0, this.subjects.length)),
                    condition.compareFunction(...args.slice(this.subjects.length))
                )
            }
        })
    }

    and(condition) {
        // short circuiting
        if (this == Condition.False || condition == Condition.False)
            return Condition.False

        return this.join((a, b) => a && b, condition, "and")
    }

    or(condition) {
        // short circuiting
        if (this == Condition.True || condition == Condition.True)
            return Condition.True

        return this.join((a, b) => a || b, condition, "or")
    }

    substitute(type, substiutionFunction = x => x) {
        return Object.assign(new Condition(), this, {
            subjects: this.subjects.map(
                sub => sub instanceof type ? substiutionFunction(sub) : sub
            )
        })
    }

    valueOf() {
        return this.compareFunction(...this.subjects)
    }
}


export class Sentinel { }


export class TableField extends Sentinel {
    constructor(field) {
        super()
        this.field = field
    }
}
