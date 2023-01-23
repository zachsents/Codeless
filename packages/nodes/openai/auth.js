import { Configuration, OpenAIApi } from "openai"


export function authorizeOpenAIAPI() {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_SECRET_KEY,
    })

    return new OpenAIApi(configuration)
}