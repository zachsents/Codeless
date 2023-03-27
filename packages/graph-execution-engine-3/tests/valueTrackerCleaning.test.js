/**
 * Tests that the ValueTracker.cleanValue function works as expected
 * for a wide range of input values.
 */
import { ValueTracker } from "../ValueTracker.js"


test("null and undefined values", () => {
    expect(ValueTracker.cleanValue(null)).toBe(null)
    expect(ValueTracker.cleanValue(undefined)).toBe(null)
})

test("primitive values", () => {
    expect(ValueTracker.cleanValue(1)).toBe(1)
    expect(ValueTracker.cleanValue("1")).toBe("1")
    expect(ValueTracker.cleanValue(true)).toBe(true)
    expect(ValueTracker.cleanValue(false)).toBe(false)
})

test("Date values", () => {
    const date = new Date()
    expect(ValueTracker.cleanValue(date)).toBe(date)
})

test("toString values", () => {
    const value = {
        toString: () => "toString"
    }
    expect(ValueTracker.cleanValue(value)).toBe("toString")
})

test("arrays", () => {
    const value = [1, "1", true, false]
    expect(ValueTracker.cleanValue(value)).toEqual(value)   
})

test("nested arrays", () => {
    const value = [1, "1", true, false, [1, "1", true, false]]
    const expected = [1, "1", true, false, "[1,\"1\",true,false]"]
    expect(ValueTracker.cleanValue(value)).toEqual(expected)
})

test("circular references", () => {
    const value = {}
    value.value = value
    expect(ValueTracker.cleanValue(value)).toBe("[Circular]")
})

test("class instances", () => {
    class TestClass {
        value = 1
    }
    const value = new TestClass()
    expect(ValueTracker.cleanValue(value)).toEqual({ value: 1 })
})

test("class instances with toString methods", () => {
    class TestClass {
        value = 1
        toString() {
            return "toString"
        }
    }
    const value = new TestClass()
    expect(ValueTracker.cleanValue(value)).toBe("toString")
})

test("class instances with circular references", () => {
    class TestClass {
        value = 1
    }
    const value = new TestClass()
    value.value = value
    expect(ValueTracker.cleanValue(value)).toBe("[Circular]")
})

test("normal objects", () => {
    const value = { value: 1 }
    expect(ValueTracker.cleanValue(value)).toEqual({ value: 1 })
})

test("nested objects", () => {
    const value = { value: { value: 1 } }
    expect(ValueTracker.cleanValue(value)).toEqual({ value: { value: 1 } })
})