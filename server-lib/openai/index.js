import { defineSecret } from "firebase-functions/params"
import { Configuration, OpenAIApi } from "openai"


export const CHARACTER_LIMIT = 1000 * 4    // 1 token ~= 4 chars


export const openaiSecretKey = defineSecret("OPENAI_SECRET_KEY", {
    description: "OpenAI Secret API Key",
})


function api() {
    return new OpenAIApi(
        new Configuration({
            apiKey: openaiSecretKey.value(),
        })
    )
}


export async function createChatCompletion(prompt, {
    temperature = 1,
} = {}) {

    checkCharacterLimit(prompt, 8192)

    const resp = await api().createChatCompletion({
        model: "gpt-4-32k",
        messages: [{
            role: "user",
            content: prompt,
        }],
        temperature,
    })

    if (resp.status >= 400)
        throw new Error(`OpenAI request failed: ${resp.statusText}`)

    return resp.data.choices[0].message.content
}


export async function createCompletion(prompt, {
    model = "text-davinci-003",
    temperature = 0,
    max_tokens = 1000,
    frequency_penalty = 0.0,
    presence_penalty = 0.0,
} = {}) {

    checkCharacterLimit(prompt)

    const resp = await api().createCompletion({
        prompt,
        model,
        temperature,
        max_tokens,
        frequency_penalty,
        presence_penalty,
    })

    if (resp.status >= 400)
        throw new Error(`OpenAI request failed: ${resp.statusText}`)

    return resp.data.choices[0].text
}


function checkCharacterLimit(prompt, limit = CHARACTER_LIMIT) {
    if (prompt?.length > limit)
        throw new Error(`Prompt exceeds character limit of ${CHARACTER_LIMIT} characters.`)
}
