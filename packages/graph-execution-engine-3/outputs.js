

class Tracker {
    
    items = {}

    constructor({
        multiple = false,
    } = {}) {
        this.multiple = multiple
    }

    report(key, value) {
        if (this.multiple)
            (this.items[key] ??= []).push(value)
        else
            this.items[key] = value
    }

    reset() {
        this.items = {}
    }

    get() {
        return this.items
    }
}

export const Outputs = new Tracker()
export const Errors = new Tracker({ multiple: true })
export const Returns = new Tracker({ multiple: true })