
export const Trigger = {
    HTTP: "trigger:http",
    Manual: "trigger:manual",
}

export const TriggerCategories = {
    Manual: {
        name: "Scheduled",
        icon: "Clock",
        triggers: [ Trigger.Manual ],
    },
    HTTP: {
        name: "HTTP",
        icon: "World",
        triggers: [ Trigger.HTTP ],
    },
}

export default {
    [Trigger.HTTP]: GenericTrigger(Trigger.HTTP),
    [Trigger.Manual]: GenericTrigger(Trigger.Manual),
}

function GenericTrigger(id) {
    return {
        id,
        name: "Trigger",
        sources: {
            signals: {
                " ": { }
            }
        },
        setup(setupObservable) {
            setupObservable?.subscribe(setupPayload => {
                this[" "](setupPayload)
            })
        },
    }
}