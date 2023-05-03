import chalk from "chalk"
import { createElement } from "react"
import { render } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"

export function testTitle(title) {
    console.log(chalk.bold.bgWhite(`\n${title}\n`))
}

export function testSubtitle(subtitle) {
    console.log(chalk.bold.bgGray.whiteBright(`\n${subtitle}\n`))
}

export function passOrFail(condition, {
    passed = "Passed",
    failed = "Failed",
} = {}) {
    console.log(
        condition ?
            chalk.green.bold(`✔ ${passed}`) :
            chalk.red.bold(`✖ ${failed}`)
    )
}

export function startSection(header = "", char = "-") {
    const padding = char.repeat((process.stdout.columns - header.length - 2) / 2)
    console.log(`
${padding} ${chalk.bold.bgGray.whiteBright(header)} ${padding}\n`)
}

export function endSection(char = "-") {
    console.log(char.repeat(process.stdout.columns))
}

export class TestSeries {
    trials = []

    async try(name, func, {
        shouldBeTruthy = false,
        logResult = false,
    } = {}) {
        startSection(name)

        try {
            const result = await func?.()

            if (shouldBeTruthy && !result)
                throw new Error("Test result wasn't truthy.")

            if (logResult)
                console.log(typeof logResult == "function" ? logResult(result) : result)

            this.trials.push(true)

            console.log()
            passOrFail(true)
            return result
        }
        catch (err) {
            console.error(err)
            console.log(chalk.bold.red(`\nFailed on ${name}\n`))
            this.trials.push(false)

            console.log()
            passOrFail(false)
        }
    }

    eval() {
        console.log()
        endSection()
        console.log()
        passOrFail(this.trials.every(t => !!t), {
            passed: "All Tests Passed\n",
            failed: "Some Tests Failed\n",
        })
    }
}

/**
 * This doesn't work without a testing framework. Need to use something
 * like Jest and enable the "testEnvironment: jsdom" option.
 */
export function testComponentInQueryWrapper(...args) {

    const queryClient = new QueryClient()

    const ourElement = createElement(...args)

    const containerElement = createElement(QueryClientProvider, {
        client: queryClient,
    }, ourElement)

    render(containerElement)
}