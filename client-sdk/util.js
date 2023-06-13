import { useCallback, useId } from "react"
import { useQuery } from "react-query"


export function useCallbackWithRequirements(callback, deps = [], {
    quiet = false,
} = {}) {
    return useCallback((...args) => {
        if (deps.some(dep => dep == null)) {
            if (quiet) return
            throw new Error("Some dependencies of useCallbackWithRequirements are null")
        }
        return callback?.(...args)
    }, deps)
}


export function safelyCall(func, ...args) {
    if (args.some(arg => arg == null))
        return
    return func?.(...args)
}


export function useActionQuery(queryFn, queryKey, queryProps = {}) {

    queryKey ??= [useId()]

    const { refetch, ...result } = useQuery({
        queryKey,
        queryFn,
        enabled: false,
        ...queryProps,
    })

    return [refetch, result]
}
