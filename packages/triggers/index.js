
export const Trigger = {
    HTTP: "trigger:http",
    Manual: "trigger:manual",
}

export const TriggerCategories = {
    Manual: {
        name: "Manual",
        icon: "HandClick",
        triggers: [ Trigger.Manual ],
    },
    HTTP: {
        name: "HTTP",
        icon: "World",
        triggers: [ Trigger.HTTP ],
    },
}