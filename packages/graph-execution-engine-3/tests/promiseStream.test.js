import { subscribe, watch } from "../promiseStream.js"

console.log("Start")

// set up subscription
subscribe()
.then(() => {
    console.log("Resolved!")
})

// watch some timers
watch(promiseTimer(3000))
watch(promiseTimer(2000))

setTimeout(() => {
    watch(promiseTimer(2400))
}, 2100)


function promiseTimer(time) {
    return new Promise(resolve => {
        console.log(`Starting ${time}ms timer`)
        setTimeout(() => {
            console.log(`Ending ${time}ms timer`)
            resolve()
        }, time)
    })
}