
const IMPLEMENTATION_ERROR = new Error("Strategy is not meant to be used directly. Use a subclass instead.")

export class Strategy {

    useOptions() {
        throw IMPLEMENTATION_ERROR
    }

    useFunctionOverrides() {
        throw IMPLEMENTATION_ERROR
    }
}