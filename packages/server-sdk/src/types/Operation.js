import { Sentinel } from "./Sentinel.js"


export const OperationFactory = {
    Fixed: (name, operationFunction) => (...params) => operationOrResult(name, operationFunction, ...params),
    Variadic: (name, binaryReducer) => (...params) => operationOrResult(name, (...params) => params.reduce(binaryReducer), ...params),
}


export class Operation extends Sentinel {

    // Primitives
    static True = new Operation("true", () => true)
    static False = new Operation("false", () => false)

    // Comparison
    static Equals = OperationFactory.Fixed("equals", (a, b) => a == b)
    static NotEqual = OperationFactory.Fixed("not-equal", (a, b) => a != b)
    static GreaterThan = OperationFactory.Fixed("greater-than", (a, b) => a > b)
    static GreaterThanOrEqualTo = OperationFactory.Fixed("greater-than-or-equal", (a, b) => a >= b)
    static LessThan = OperationFactory.Fixed("less-than", (a, b) => a < b)
    static LessThanOrEqualTo = OperationFactory.Fixed("less-than-or-equal", (a, b) => a <= b)

    // Logical
    static Not = OperationFactory.Fixed("not", (a) => !a)
    static And = OperationFactory.Variadic("and", (a, b) => a && b)
    static Or = OperationFactory.Variadic("or", (a, b) => a || b)

    // Strings
    static Contains = OperationFactory.Fixed("contains", (a, b) => a.includes(b))
    static MatchesRegex = OperationFactory.Fixed("matches-regex", (a, b) => b.test(a))

    // Math
    static Add = OperationFactory.Variadic("add", (a, b) => a + b)
    static Subtract = OperationFactory.Variadic("subtract", (a, b) => a - b)
    static Multiply = OperationFactory.Variadic("multiply", (a, b) => a * b)
    static Divide = OperationFactory.Variadic("divide", (a, b) => a / b)
    static Power = OperationFactory.Fixed("power", (a, b) => a ** b)


    /**
     * Creates an instance of Operation.
     * @param {string} name
     * @param {(...params: any[]) => *} operationFunction
     * @param {...any} params
     * @memberof Operation
     */
    constructor(name, operationFunction, ...params) {
        super()
        this.name = name
        this.operationFunction = operationFunction
        this.params = params
    }


    get flatParams() {
        return this.params.reduce((acc, param) => [
            ...acc,
            ...(param instanceof Operation ? param.flatParams : [param]),
        ], [])
    }


    /**
     * And operation for Operation chaining. Also has short-circuiting behavior.
     * @memberof Operation
     */
    and(...params) {
        // short circuiting
        if (this == Operation.False || params.includes(Operation.False) || params.includes(false))
            return Operation.False

        return Operation.And(this, ...params)
    }


    /**
     * Or operation for Operation chaining. Also has short-circuiting behavior.
     * @memberof Operation
     */
    or(...params) {
        // short circuiting
        if (this == Operation.True || params.includes(Operation.True) || params.includes(true))
            return Operation.True

        return Operation.Or(this, ...params)
    }


    /**
     * Creates a new Condition with the specified type replaced
     * by the value determined by the substitution function. Recurses
     * to nested Conditions.
     *
     * @param {Function} type
     * @param {(param: *) => *} [substiutionFunction=x => x]
     * @return {Operation}
     * @memberof Operation
     */
    substitute(type, substiutionFunction = x => x) {
        return Object.assign(new Operation(), this, {
            params: this.params.map(param => {
                // 1st - recurse other Conditions
                if (param instanceof Operation)
                    return param.substitute(type, substiutionFunction)

                // 2nd - substitute specified type
                if (param instanceof type)
                    return substiutionFunction(param)

                // fallback - return straight up
                return param
            })
        })
    }


    /**
     * Recursively evaluates Operations.
     * @memberof Operation
     */
    valueOf() {
        return this.params.map(param => param?.valueOf())
            |> this.operationFunction(...^^)
    }


    /**
     * Converts to a string. Useful for generating formulas.
     *
     * @param {object} [paramMappings={}]
     * @param {object} [operationMappings={}]
     * @return {string} 
     * @memberof Operation
     */
    toString(paramMappings = {}, operationMappings = {}) {
        const defaultOp = (...params) => `(${params.join(` ${this.name} `)})`

        // prep parameters -- will recurse for Operations if it is not in the mappings
        return this.params.map(param => {
            const mapFunc = paramMappings[param?.constructor?.name] ?? paramMappings[typeof param]

            // return if there is a mapping for this type
            const mapped = mapFunc?.(param)
            if (mapped != null)
                return mapped

            // try to recurse the toString method, otherwise just call it
            // normally
            // * need this because calling Number.toString with these params
            //   will throw an error
            try {
                return param.toString?.(paramMappings, operationMappings)
            }
            catch (err) {
                if (err instanceof RangeError)
                    return param.toString()
                throw err
            }
        })
            // pipe into operation function
            |> (operationMappings[this.name] ?? defaultOp)(...^^)
    }
}


/**
 * Returns an Operation if any of the params are Sentinels, otherwise returns the result of the operation function.
 *
 * @param {string} name
 * @param {(...params: any[]) => *} operationFunction
 * @param {...any} params
 * @return {Operation | *} 
 */
function operationOrResult(name, operationFunction, ...params) {

    const shouldReturnOperation = params.some(param => param instanceof Sentinel)

    return shouldReturnOperation ?
        new Operation(name, operationFunction, ...params) :
        operationFunction(...params)
}