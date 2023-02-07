import { Configuration, OpenAIApi } from "openai"


const CHARACTER_LIMIT = 1000 * 4    // 1 token ~= 4 chars


export default {

    api: new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPENAI_SECRET_KEY,
        })
    ),

    async createCompletion(prompt, {
        model = "text-davinci-003",
        temperature = 0,
        max_tokens = 300,
        frequency_penalty = 0.0,
        presence_penalty = 0.0,
    } = {}) {

        checkCharacterLimit(prompt)
        
        const resp = await this.api.createCompletion({
            prompt,
            model,
            temperature,
            max_tokens,
            frequency_penalty,
            presence_penalty,
        })
        
        if(resp.status >= 400)
            throw new Error(`OpenAI request failed: ${resp.statusText}`)

        return resp.data.choices[0].text
    }
}

function checkCharacterLimit(prompt) {
    if(prompt?.length > CHARACTER_LIMIT)
        throw new Error(`Prompt exceeds character limit of ${CHARACTER_LIMIT} characters.`)
}